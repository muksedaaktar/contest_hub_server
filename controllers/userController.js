import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

/* =========================
   PUBLIC: Create new user
========================= */
export const createUser = async (req, res) => {
  try {
    const usersCollection = getDB().collection("users");
    const { name, email, photoURL } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Default role = "user"
    const newUser = {
      name,
      email,
      photoURL,
      role: "user",
      participatedContests: [],
      wonContests: [],
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: Get all users
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const usersCollection = getDB().collection("users");
    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADMIN: Update user role
========================= */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["admin", "creator", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const usersCollection = getDB().collection("users");
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   USER: Update own profile
========================= */
export const updateUserProfile = async (req, res) => {
  try {
    const usersCollection = getDB().collection("users");
    const { name, password, photoURL } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (photoURL) updateData.photoURL = photoURL;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const result = await usersCollection.updateOne(
      { email: req.user.email },
      { $set: updateData }
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   USER: Get participated & won contests
========================= */
export const getUserContests = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const contestsCollection = db.collection("contests");

    const user = await usersCollection.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const participatedContests = await contestsCollection
      .find({
        _id: {
          $in: (user.participatedContests || []).map((id) => new ObjectId(id)),
        },
      })
      .toArray();

    const wonContests = await contestsCollection
      .find({
        _id: {
          $in: (user.wonContests || []).map((id) => new ObjectId(id)),
        },
      })
      .toArray();

    res.json({ participatedContests, wonContests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};