import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { resend } from "./resend";
import { admin, emailOTP, organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      // prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        enum: ["user", "admin"],
      },
      department: {
        type: "string",
        required: false,
        defaultValue: null,
        enum: [
          "sales",
          "engineering",
          "hr",
          "research",
          "marketing",
          "instructor",
        ],
      },
      phoneNumber: {
        type: "number",
        required: false,
        defaultValue: null,
      },
      officeLocation: {
        type: "string",
        required: false,
        defaultValue: null,
      },
    },
  },
  plugins: [
    admin(),
    organization(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Emmaus <onboarding@resend.dev>",
          to: [email],
          subject: "Emmaus-Diary - Your OTP Code",
          html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });
      },
    }),
  ],
});
