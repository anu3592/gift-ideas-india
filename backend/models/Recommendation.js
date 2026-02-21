const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    // Who is the gift for
    recipient: { type: String, required: true },   // e.g. "Mom", "Best Friend"
    relation: { type: String, required: true },    // e.g. "mother", "friend"
    age: Number,
    occasion: { type: String, required: true },    // e.g. "Birthday", "Anniversary"
    budget: { type: Number, required: true },
    interests: [String],                           // e.g. ["cooking", "reading"]
    genderHint: String,                            // "male", "female", "any"

    // AI generated gift ideas
    giftIdeas: [
      {
        name: String,
        description: String,
        whyPerfect: String,
        searchKeyword: String,
        emoji: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
