import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

// Admin: get all users
export const getAllUsers = async (req, res) => {
  try {
    const usersCollection = getDB().collection("users");
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const usersCollection = getDB().collection("users");

    if (!["admin", "creator", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    res.json({ message: "Role updated", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Normal user: update own profile
export const updateUserProfile = async (req, res) => {
  try {
    const usersCollection = getDB().collection("users");
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: updateData }
    );

    res.json({ message: "Profile updated", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Normal user: get participated & won contests
export const getUserContests = async (req, res) => {
  try {
    const usersCollection = getDB().collection("users");
    const contestsCollection = getDB().collection("contests");

    const user = await usersCollection.findOne({ _id: new ObjectId(req.user._id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    const participatedContests = await contestsCollection
      .find({ _id: { $in: user.participatedContests || [] } })
      .toArray();

    const wonContests = await contestsCollection
      .find({ _id: { $in: user.wonContests || [] } })
      .toArray();

    res.json({ participatedContests, wonContests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
