const Groq = require("groq-sdk");
const axios = require("axios");
const Recommendation = require("../models/Recommendation");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Step 1: AI generates gift ideas ─────────────────────────────────────────
async function generateGiftIdeas(formData) {
  const { recipient, relation, age, occasion, budget, interests, genderHint } = formData;

  const prompt = `You are a thoughtful gift recommendation expert.

Generate 5 perfect gift ideas for the following person:
- Recipient: ${recipient} (${relation})
- Age: ${age || "not specified"}
- Occasion: ${occasion}
- Budget: ₹${budget}
- Interests/Hobbies: ${interests?.length > 0 ? interests.join(", ") : "not specified"}
- Gender: ${genderHint || "not specified"}

Return ONLY a valid JSON array (no extra text, no markdown):
[
  {
    "name": "Gift Name",
    "emoji": "🎁",
    "description": "One line description of this gift",
    "whyPerfect": "Why this gift is perfect for this specific person and occasion (2 sentences)",
    "searchKeyword": "simple 3-4 word Amazon/Flipkart search query to find this product"
  }
]

Rules:
- All 5 gifts must be under ₹${budget} budget
- Make gifts personal and thoughtful, not generic
- searchKeyword must be simple and specific enough to find real products online
- Vary the gift types (don't suggest 5 similar things)
- No extra text outside the JSON array`;

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.8,
  });

  const text = res.choices[0].message.content.trim();

  // Extract JSON array safely
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("AI did not return valid JSON");
  return JSON.parse(jsonMatch[0]);
}

// ─── Step 2: Fetch live products from Amazon via RapidAPI ─────────────────────
async function fetchAmazonProducts(keyword, budget) {
  try {
    const res = await axios.get("https://real-time-amazon-data.p.rapidapi.com/search", {
      params: { query: keyword, page: "1", country: "IN", sort_by: "RELEVANCE" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
      },
      timeout: 8000,
    });

    let products = res.data?.data?.products || [];

    // Filter by budget
    products = products.filter((p) => {
      const price = parseFloat(p.product_price?.replace(/[^0-9.]/g, ""));
      return !isNaN(price) && price <= budget;
    });

    return products.slice(0, 3).map((p) => ({
      platform: "amazon",
      platformLabel: "Amazon",
      platformColor: "#ff9900",
      platformIcon: "📦",
      name: p.product_title?.slice(0, 80) + (p.product_title?.length > 80 ? "..." : ""),
      price: p.product_price,
      priceNum: parseFloat(p.product_price?.replace(/[^0-9.]/g, "")) || null,
      rating: p.product_star_rating,
      totalRatings: p.product_num_ratings,
      image: p.product_photo,
      buyLink: `${p.product_url}&tag=${process.env.AMAZON_AFFILIATE_TAG || ""}`,
    }));
  } catch (err) {
    console.error(`Amazon fetch error for "${keyword}":`, err.message);
    return [];
  }
}

// ─── Step 3: Fetch live products from Flipkart via RapidAPI ──────────────────
async function fetchFlipkartProducts(keyword, budget) {
  try {
    const res = await axios.get("https://flipkart-product-search.p.rapidapi.com/search", {
      params: { q: keyword, page: "1" },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "flipkart-product-search.p.rapidapi.com",
      },
      timeout: 8000,
    });

    let products = res.data?.products || res.data?.data || [];
    if (!Array.isArray(products)) products = [];

    products = products.filter((p) => {
      const price = parseFloat(
        (p.price || p.selling_price || "").toString().replace(/[^0-9.]/g, "")
      );
      return !isNaN(price) && price <= budget;
    });

    return products.slice(0, 2).map((p) => ({
      platform: "flipkart",
      platformLabel: "Flipkart",
      platformColor: "#2874f0",
      platformIcon: "🛒",
      name: (p.title || p.name || "")?.slice(0, 80),
      price: p.price || p.selling_price,
      priceNum: parseFloat((p.price || p.selling_price || "").toString().replace(/[^0-9.]/g, "")) || null,
      rating: p.rating,
      totalRatings: p.num_ratings || p.rating_count,
      image: p.image || p.thumbnail,
      buyLink: `${p.url || p.product_url || "https://flipkart.com"}${
        process.env.FLIPKART_AFFILIATE_ID ? `?affid=${process.env.FLIPKART_AFFILIATE_ID}` : ""
      }`,
    }));
  } catch (err) {
    console.error(`Flipkart fetch error for "${keyword}":`, err.message);
    return [];
  }
}

// ─── Main Controller: Generate + Fetch ───────────────────────────────────────
exports.generateGifts = async (req, res) => {
  try {
    const { recipient, relation, age, occasion, budget, interests, genderHint } = req.body;

    if (!recipient || !occasion || !budget) {
      return res.status(400).json({ error: "Recipient, occasion, and budget are required!" });
    }

    console.log(`🎁 Generating gifts for ${recipient} | Occasion: ${occasion} | Budget: ₹${budget}`);

    // Step 1: AI generates gift ideas
    const giftIdeas = await generateGiftIdeas({ recipient, relation, age, occasion, budget, interests, genderHint });
    console.log(`✅ AI generated ${giftIdeas.length} gift ideas`);

    // Step 2: For each gift idea, fetch products from Amazon & Flipkart in parallel
    const giftsWithProducts = await Promise.all(
      giftIdeas.map(async (gift) => {
        const [amazonProducts, flipkartProducts] = await Promise.allSettled([
          fetchAmazonProducts(gift.searchKeyword, budget),
          fetchFlipkartProducts(gift.searchKeyword, budget),
        ]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : [])));

        const allProducts = [...amazonProducts, ...flipkartProducts];

        // Find cheapest product across platforms
        const withPrice = allProducts.filter((p) => p.priceNum);
        const cheapest = withPrice.length > 0
          ? withPrice.reduce((a, b) => (a.priceNum < b.priceNum ? a : b))
          : null;

        return {
          ...gift,
          products: allProducts,
          cheapestPlatform: cheapest?.platform || null,
          cheapestPrice: cheapest?.price || null,
        };
      })
    );

    // Step 3: Save to MongoDB
    try {
      await Recommendation.create({
        recipient, relation, age, occasion, budget,
        interests: interests || [],
        genderHint,
        giftIdeas,
      });
    } catch (dbErr) {
      console.warn("DB save skipped:", dbErr.message);
    }

    res.json({
      success: true,
      recipient,
      occasion,
      budget,
      gifts: giftsWithProducts,
    });
  } catch (err) {
    console.error("Gift generation error:", err);
    res.status(500).json({ error: "Could not generate gift ideas. Please try again!" });
  }
};
