// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // enable email/password auth
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // automatically sign in after signup
  },

  // configure social providers (Google in this case)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // optional plugins can go here
  plugins: [
    // e.g. twoFactorClient({ twoFactorPage: "/two-factor" })
  ],
});
