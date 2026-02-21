# 🎁 GiftGenie — AI-Powered Gift Recommendation App

> Tell us who you're gifting, the occasion, and budget — AI suggests perfect gifts and finds them live on Amazon & Flipkart!

## How It Works

```
User fills form (recipient, occasion, budget, interests)
        ↓
AI generates 5 thoughtful, personalized gift ideas
        ↓
Each gift is searched live on Amazon + Flipkart
        ↓
Products shown with prices, ratings, and buy links
        ↓
User clicks → goes to platform with affiliate link → you earn commission! 💰
```

## Project Structure

```
giftgenie/
├── backend/
│   ├── controllers/giftController.js  ← Core AI + product fetching logic
│   ├── models/Recommendation.js       ← MongoDB schema (saves search history)
│   ├── routes/gift.js                 ← POST /api/gifts
│   ├── routes/history.js              ← GET /api/history
│   ├── server.js                      ← Express entry point
│   └── .env.example
│
└── frontend/
    └── src/
        ├── pages/Home.js              ← Gift form (recipient, occasion, budget, interests)
        ├── pages/Results.js           ← Shows AI gift ideas + product cards
        └── components/GiftCard.js     ← Individual gift with buy links
```

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your API keys in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `GROQ_API_KEY` | Groq API key (free at console.groq.com) |
| `RAPIDAPI_KEY` | RapidAPI key (free at rapidapi.com) |
| `AMAZON_AFFILIATE_TAG` | Your Amazon affiliate tag |
| `FLIPKART_AFFILIATE_ID` | Your Flipkart affiliate ID |

## RapidAPI Setup

Subscribe to these 2 free APIs on rapidapi.com:
1. **Real-Time Amazon Data** — for Amazon products
2. **Flipkart Product Search** — for Flipkart products

One RapidAPI key works for both!

## No Manual Data Needed!

- AI generates all gift ideas dynamically
- Products fetched live from Amazon & Flipkart
- MongoDB only saves search history (optional)
