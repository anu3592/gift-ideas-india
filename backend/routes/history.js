const express = require("express");
const router = express.Router();
const Recommendation = require("../models/Recommendation");

// GET recent recommendations
router.get("/", async (req, res) => {
  try {
    const history = await Recommendation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("recipient relation occasion budget createdAt");
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
