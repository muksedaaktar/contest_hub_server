import { getDB } from "../config/db.js";

export const getLeaderboard = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await usersCollection.countDocuments();
    const leaderboard = await usersCollection
      .find({})
      .sort({ "wonContests.length": -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      users: leaderboard,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
