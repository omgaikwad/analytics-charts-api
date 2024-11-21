const express = require("express");
const {
  getFilteredData,
  getFeatureTimeTrend,
} = require("../controllers/dataController");

const router = express.Router();

// Route to get filtered data
router.get("/data", getFilteredData);

// Route to get feature time trend
router.get("/time-trend-data", getFeatureTimeTrend);

module.exports = router;
