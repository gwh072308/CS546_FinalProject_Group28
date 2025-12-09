import { arrests } from "../config/mongoCollections.js";

const exportedMethods = {
  async getMonthlyTrends() {
    const arrestCollection = await arrests();

    const pipeline = [
      {
        $group: {
          _id: { $substr: ["$arrest_date", 0, 7] },
          totalArrests: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await arrestCollection.aggregate(pipeline).toArray();

    return results.map(r => ({
      month: r._id,
      totalArrests: r.totalArrests
    }));
  },

  async getWeeklyTrends() {
    const arrestCollection = await arrests();

    const pipeline = [
      {
        $project: {
          week: { $isoWeek: { $dateFromString: { dateString: "$arrest_date" } } },
          year: { $year: { $dateFromString: { dateString: "$arrest_date" } } }
        }
      },
      {
        $group: {
          _id: { year: "$year", week: "$week" },
          totalArrests: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } }
    ];

    const results = await arrestCollection.aggregate(pipeline).toArray();

    return results.map(r => ({
      year: r._id.year,
      week: r._id.week,
      totalArrests: r.totalArrests
    }));
  }
};

export default exportedMethods;
