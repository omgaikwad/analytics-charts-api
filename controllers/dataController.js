const Analytics = require("../models/Analytics");

const getFilteredData = async (req, res) => {
  const { startDate, endDate, age, gender } = req.query;

  try {
    // Log incoming request parameters
    console.log("Query parameters:", { startDate, endDate, age, gender });

    const filters = {};

    if (age) filters.age = age;
    if (gender) filters.gender = gender;
    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Log constructed filters
    console.log("Applied filters:", filters);

    // First check if we have any matching documents
    const matchingDocs = await Analytics.find(filters).limit(1);
    if (matchingDocs.length === 0) {
      console.log("No documents found matching filters");
      return res.status(200).json([]);
    }

    const aggregatedData = await Analytics.aggregate([
      { $match: filters },
      {
        $group: {
          _id: "$feature",
          totalTimeSpent: { $sum: "$timeSpent" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          feature: "$_id",
          totalTimeSpent: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Log result
    console.log(`Found ${aggregatedData.length} aggregated results`);

    res.status(200).json(aggregatedData);
  } catch (err) {
    console.error("Error in getFilteredData:", err);
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
};

const getFeatureTimeTrend = async (req, res) => {
  const { feature, startDate, endDate, age, gender } = req.query;

  try {
    // Log incoming request parameters
    console.log("Request body:", { feature, startDate, endDate, age, gender });

    if (!feature) {
      return res.status(400).json({ message: "Feature name is required" });
    }

    const filters = { feature };

    if (age) filters.age = age;
    if (gender) filters.gender = gender;
    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Log constructed filters
    console.log("Applied filters for feature time trend:", filters);

    const timeTrendData = await Analytics.aggregate([
      { $match: filters },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalTimeSpent: { $sum: "$timeSpent" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sort by date ascending
      {
        $project: {
          date: "$_id",
          totalTimeSpent: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Log result
    console.log(`Found ${timeTrendData.length} time trend results`);

    res.status(200).json(timeTrendData);
  } catch (err) {
    console.error("Error in getFeatureTimeTrend:", err);
    res.status(500).json({
      message: "Error fetching time trend data",
      error: err.message,
    });
  }
};

module.exports = { getFilteredData, getFeatureTimeTrend };
