const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB client
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
app.get("/ping", async (req, res) => {
  try {
    await client.db("admin").command({ ping: 1 });
    res.send("MongoDB connected 🎯");
  } catch (error) {
    res.status(500).send("MongoDB not connected ❌");
  }
});


async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully");

    const db = client.db("contesthubDB");
    const usersCollection = db.collection("users");
    const contestsCollection = db.collection("contests");

    // test route
    app.get("/", (req, res) => {
      res.send("ContestHub Server is running 🚀");
    });

  } finally {
    // keep connection alive
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
