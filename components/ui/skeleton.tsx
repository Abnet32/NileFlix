import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-sm bg-linear-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer", className)}
      {...props}
    />
  )
}

export { Skeleton }
