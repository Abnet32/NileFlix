import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI");
}

const dbName = process.env.MONGODB_DB ?? "nileflix";

declare global {
  var _mongoClient: MongoClient | undefined;
}

export const client = global._mongoClient ?? new MongoClient(uri);

if (!global._mongoClient) {
  global._mongoClient = client;
}

export const db: Db = client.db(dbName);
