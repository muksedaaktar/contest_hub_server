import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";


export const addContest = async (req, res) => {
  try {
    const db = getDB();
    const contestsCollection = db.collection("contests");

    const {
      name,     
      image,
      details,     
      prize,
      price,
      task,
      type,        
      deadline,
    } = req.body;

    
    if (!name || !image || !details || !prize || !price || !task || !type || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContest = {
      title: name,               
      image,
      description: details,      
      prizeMoney: Number(prize), 
      price: Number(price),      
      task,
      contestType: type,         
      deadline: new Date(deadline),
      // approved: false,
      // participants: 0,
      // winner: null,
    };

    const result = await contestsCollection.insertOne(newContest);

    res.status(201).json({
      message: "Contest added successfully",
      contestId: result.insertedId,
    });
  } catch (error) {
    console.error("Add contest error:", error);
    res.status(500).json({ message: "Failed to add contest" });
  }
};

/* =========================
   ADMIN: Approve Contest
========================= */
export const approveContest = async (req, res) => {
  try {
    const db = getDB();
    const contestsCollection = db.collection("contests");

    const { contestId } = req.params;
    if (!contestId) return res.status(400).json({ message: "Contest ID required" });

    const result = await contestsCollection.updateOne(
      { _id: new ObjectId(contestId) },
      { $set: { approved: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Contest not found or already approved" });
    }

    res.json({ message: "Contest approved successfully" });
  } catch (error) {
    console.error("Approve contest error:", error);
    res.status(500).json({ message: "Failed to approve contest" });
  }
};

/* =========================
   CREATOR: Declare Winner
========================= */
export const declareWinner = async (req, res) => {
  try {
    const db = getDB();
    const contestsCollection = db.collection("contests");

    const { contestId, winner } = req.body;
    if (!contestId || !winner) return res.status(400).json({ message: "Contest ID and winner required" });

    const result = await contestsCollection.updateOne(
      { _id: new ObjectId(contestId) },
      { $set: { winner } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Contest not found or winner already declared" });
    }

    res.json({ message: "Winner declared successfully" });
  } catch (error) {
    console.error("Declare winner error:", error);
    res.status(500).json({ message: "Failed to declare winner" });
  }
};

/* =========================
   PUBLIC: Get Approved Contests
========================= */
export const getApprovedContests = async (req, res) => {
  try {
    const db = getDB();
    const contestsCollection = db.collection("contests");

    const contests = await contestsCollection.find({ approved: true }).toArray();

    // Map backend fields to frontend-friendly fields
    const response = contests.map(c => ({
      id: c._id,
      name: c.title,
      type: c.contestType,
      image: c.image,
      participants: c.participants || 0,
      short_description: c.short_description || "",
      details: c.description,
      task: c.task,
      prize: c.prizeMoney,
      winner: c.winner || null,
      deadline: c.deadline,
    }));

    res.json(response);
  } catch (error) {
    console.error("Get contests error:", error);
    res.status(500).json({ message: "Failed to fetch contests" });
  }
};


