import { cn } from "@/lib/utils";

/**
 * Track marquee tak berujung. Anak-anaknya dirender dua kali supaya
 * pergeseran sejauh 50% kembali ke titik yang identik.
 * Salinan kedua disembunyikan dari pembaca layar.
 */
export function Marquee({
  children,
  speed = 38,
  direction = "right",
  className,
  jedaSaatHover = false,
}: {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  /**
   * Menghentikan jalannya track selama kursor berada di atasnya.
   *
   * Opsional, bukan bawaan: pita dekoratif di hero dan CTA menutupi bidang
   * yang lebar, dan membekukannya setiap kursor kebetulan lewat justru
   * terbaca seperti animasi yang tersendat. Yang benar-benar perlu berhenti
   * hanya deretan yang isinya ingin dilihat satu per satu, seperti logo.
   */
  jedaSaatHover?: boolean;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      // Marquee bersifat dekoratif; isinya juga tersedia di halaman Produk.
      aria-hidden="true"
    >
      <div
        className={cn(
          "marquee gap-6",
          direction === "left" && "marquee-left",
          jedaSaatHover && "marquee-jeda",
        )}
        style={{ ["--marquee-speed" as string]: `${speed}s` }}
      >
        <div className="flex shrink-0 gap-6 pr-6">{children}</div>
        <div className="flex shrink-0 gap-6 pr-6">{children}</div>
      </div>
    </div>
  );
}
