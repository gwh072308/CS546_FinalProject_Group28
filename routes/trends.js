import express from "express";
import trendsData from "../data/trends.js";

const router = express.Router();

router.route("/monthly").get(async (req, res) => {
  try {
    const monthlyTrends = await trendsData.getMonthlyTrends();
    res.render("trends", {
      title: "Monthly Arrest Trends",
      trends: monthlyTrends,
      type: "month"
    });
  } catch (error) {
    res.status(500).render("error", { title: "Error", error: error.message });
  }
});

router.route("/weekly").get(async (req, res) => {
  try {
    const weeklyTrends = await trendsData.getWeeklyTrends();
    res.render("trends", {
      title: "Weekly Arrest Trends",
      trends: weeklyTrends,
      type: "week"
    });
  } catch (error) {
    res.status(500).render("error", { title: "Error", error: error.message });
  }
});

export default router;
