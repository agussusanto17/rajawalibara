import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dropdown bergaya sama dengan kolom isian lain.
 *
 * Tetap memakai <select> bawaan, bukan daftar buatan sendiri. Yang bawaan
 * sudah membawa navigasi papan ketik, pencarian dengan mengetik huruf, dan
 * pemilih layar penuh di ponsel. Membangunnya ulang berarti membangun ulang
 * semua itu juga, dan biasanya ada yang tertinggal.
 *
 * Yang diganti hanya tampilannya: panah bawaan dimatikan lewat appearance-none,
 * lalu ikon sendiri ditumpuk di atasnya.
 */
export function Pilihan({
  className,
  children,
  ringkas = false,
  ...props
}: React.ComponentProps<"select"> & { ringkas?: boolean }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(
          "w-full appearance-none rounded-lg border border-line-strong bg-surface",
          "text-white outline-none transition-colors",
          "focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          ringkas ? "py-1.5 pl-3 pr-9 text-xs" : "py-2.5 pl-3.5 pr-11 text-[0.95rem]",
          className,
        )}
      >
        {children}
      </select>

      <ChevronDown
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-fg",
          ringkas ? "right-2.5 size-3.5" : "right-3.5 size-4",
        )}
      />
    </div>
  );
}
