import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

const mongoClient = new MongoClient(uri, {
  connectTimeoutMS: 10_000,
  serverSelectionTimeoutMS: 10_000,
});

export const clientPromise =
  globalForMongo.mongoClientPromise ?? mongoClient.connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}

export const client = await clientPromise;
export const db = client.db();
