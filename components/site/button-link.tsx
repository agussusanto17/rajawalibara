import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

/**
 * Tombol yang sebenarnya sebuah link.
 *
 * Base UI Button default-nya `nativeButton: true` (mengharapkan <button>).
 * Saat di-render sebagai <a> lewat next/link, flag itu wajib dimatikan agar
 * semantik dan aksesibilitasnya benar.
 */
export function ButtonLink({
  href,
  children,
  target,
  rel,
  ...props
}: {
  href: string;
  target?: string;
  rel?: string;
} & Omit<ButtonProps, "render" | "nativeButton">) {
  // Tautan keluar dibuka di tab baru dan diberi rel pengaman secara otomatis,
  // mengikuti pola yang sudah dipakai footer. Otomatis supaya tidak ada yang
  // lupa memasang rel="noopener" di kemudian hari; tetap bisa ditimpa.
  const eksternal = href.startsWith("http");

  return (
    <Button
      nativeButton={false}
      render={
        <Link
          href={href}
          target={target ?? (eksternal ? "_blank" : undefined)}
          rel={rel ?? (eksternal ? "noopener noreferrer" : undefined)}
        />
      }
      {...props}
    >
      {children}
    </Button>
  );
}
