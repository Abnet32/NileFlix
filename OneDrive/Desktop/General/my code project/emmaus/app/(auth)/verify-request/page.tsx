import { Suspense } from "react";
import VerifyRequestClient from "./_components/VerifyRequestClient";

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <VerifyRequestClient />
    </Suspense>
  );
}
