import { betterAuth } from "better-auth";
import { connectDB } from "./db";

export const auth = betterAuth({
  database: async () => {
    const db = await connectDB();
    return db.collection("users");
  },

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: ["http://localhost:3000"],
});