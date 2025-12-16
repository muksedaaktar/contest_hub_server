import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("contesthubDB");
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const getDB = () => db;
