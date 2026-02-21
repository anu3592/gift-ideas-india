const express = require("express");
const router = express.Router();
const { generateGifts } = require("../controllers/giftController");

// POST /api/gifts — Generate gift recommendations
router.post("/", generateGifts);

module.exports = router;
