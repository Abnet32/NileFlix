"use client";

import { RefreshCw } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  className?: string;
};

export default function RefreshButton({ className }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className={
        buttonVariants({ variant: "ghost", size: "lg" }) +
        (className ? ` ${className}` : "")
      }
      aria-label="Refresh"
    >
      <RefreshCw className="size-4" />
    </button>
  );
}
