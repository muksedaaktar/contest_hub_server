import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// Add new contest (creator)
export const addContest = async (req, res) => {
  try {
    const { title, type, description, prize, deadline } = req.body;
    const contestsCollection = getDB().collection("contests");

    const result = await contestsCollection.insertOne({
      title,
      type,
      description,
      prize,
      deadline,
      creatorId: req.user._id,
      approved: false,
      participants: [],
      winner: null,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/reject contest (admin)
export const approveContest = async (req, res) => {
  try {
    const { contestId, approve } = req.body; // approve: true/false
    const contestsCollection = getDB().collection("contests");

    const result = await contestsCollection.updateOne(
      { _id: new ObjectId(contestId) },
      { $set: { approved: approve } }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Declare winner (creator)
export const declareWinner = async (req, res) => {
  try {
    const { contestId, winnerId } = req.body;
    const contestsCollection = getDB().collection("contests");
    const usersCollection = getDB().collection("users");

    // Update contest
    await contestsCollection.updateOne(
      { _id: new ObjectId(contestId), creatorId: req.user._id },
      { $set: { winner: new ObjectId(winnerId) } }
    );

    // Update user
    await usersCollection.updateOne(
      { _id: new ObjectId(winnerId) },
      { $push: { wonContests: new ObjectId(contestId) } }
    );

    res.json({ message: "Winner declared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
