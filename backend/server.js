const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: "https://gift-tracker-india.vercel.app" }));
app.use(express.json());

// Rate limit gift generation (AI + API calls are expensive)
const giftLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: "Too many requests! Please wait a minute and try again." },
});

app.use("/api/gifts", giftLimiter, require("./routes/gift"));
app.use("/api/history", require("./routes/history"));

app.get("/", (req, res) => res.json({ message: "GiftGenie API is running! 🎁" }));
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected!");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 GiftIdeasIndia server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
