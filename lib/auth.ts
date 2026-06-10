// lib/auth.ts
import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      // Auto-link Google/GitHub logins to an existing account that shares the
      // same email. Both providers return verified emails, so this is safe and
      // prevents the `account_not_linked` error on cross-provider sign-in.
      trustedProviders: ["google", "github"],
      // Allow linking onto local accounts that aren't email-verified (e.g. ones
      // created via email/password), since the trusted IdP's verified email is
      // proof of ownership.
      requireLocalEmailVerified: false,
    },
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
