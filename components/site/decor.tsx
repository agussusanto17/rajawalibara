import { cn } from "@/lib/utils";

export function ColumnGuides({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <div className="mx-auto h-full w-full max-w-[1280px] border-x border-white/[0.07]" />
    </div>
  );
}
