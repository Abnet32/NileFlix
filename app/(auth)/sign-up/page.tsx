"use client";

import { Suspense } from "react";
import SignUpForm from "./signup";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
