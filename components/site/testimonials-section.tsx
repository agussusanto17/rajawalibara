import type { Testimonial } from "@/lib/site";
import type { Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";

/**
 * Testimoni sebagai kutipan berdokumen, bukan kartu bertumpuk-miring.
 *
 * Bentuk sebelumnya — kartu berwarna-warni yang miring dan mendatar mengikuti
 * gulir — bahasa visual project asal. Di sini nadanya keliru dua kali: yang
 * dikutip adalah pernyataan bagian pengadaan tentang mutu kargo, dan kartu
 * yang bergoyang membuat pernyataan itu terbaca sebagai hiasan. Yang dipakai
 * sekarang bentuk yang sama dengan sisa situs: garis rambut, tipe monospace
 * untuk atribusi, tanpa satu pun rotasi.
 *
 * Komponen server. Tidak ada lagi state carousel, jadi tidak ada JavaScript
 * yang perlu dikirim ke peramban untuk membacanya.
 *
 * Kutipan bertanda `contoh` dirender bergaris putus-putus DAN berlabel. Garis
 * putus-putus saja terlalu halus: pembaca sekilas tetap membacanya sebagai
 * testimoni sungguhan, dan itu persis hal yang penandanya ada untuk mencegah.
 */
export function TestimonialsSection({
  bahasa,
  testimonials,
  maks = 3,
}: {
  bahasa: Bahasa;
  testimonials: Testimonial[];
  /** Beranda menampilkan tiga. Selama isinya masih contoh, satu kisi penuh
   *  kutipan bertanda "belum diisi" lebih menonjolkan kekosongannya daripada
   *  menutupinya. */
  maks?: number;
}) {
  const kata = teks(bahasa);
  const items = testimonials.slice(0, maks);

  // Tanpa satu pun kutipan, seluruh bagian ini tidak ditampilkan. Judul yang
  // berdiri sendiri di atas ruang kosong lebih buruk daripada tidak ada
  // bagiannya sama sekali.
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-24 text-ink-strong sm:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow eyebrow-terang">{kata.testimoni.eyebrow}</p>
            <h2 className="mt-6 text-[2.25rem] leading-[1.06] sm:text-[3rem]">
              {/* Spasi eksplisit: <br> tidak menyumbang teks apa pun ke nama
                  aksesibel, jadi tanpa ini judulnya terbaca "Yang merekakatakan"
                  oleh pembaca layar. */}
              {kata.testimoni.judulBaris1}{" "}
              <br />
              {kata.testimoni.judulBaris2}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ink-strong/60 lg:pb-2">
            {kata.testimoni.keterangan}
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.quote} className="flex">
              <figure
                className={[
                  "flex w-full flex-col rounded-2xl p-7 sm:p-8",
                  t.contoh
                    ? "border border-dashed border-ink-strong/30"
                    : "bg-ink-strong/[0.05]",
                ].join(" ")}
              >
                {t.contoh && (
                  <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-strong/50">
                    {kata.testimoni.contohBelumDiisi}
                  </p>
                )}

                {/* Garis emas pendek menggantikan tanda kutip raksasa. Glif
                    kutip berukuran besar menyita ruang yang seharusnya jadi
                    milik kalimatnya sendiri. */}
                <span
                  aria-hidden="true"
                  className="h-0.5 w-8 shrink-0 bg-gold-ink/70"
                />

                <blockquote className="mt-6 flex-1 text-[1.05rem] leading-relaxed text-ink-strong/85">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-7 border-t border-ink-strong/12 pt-5 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.12em] text-ink-strong/55">
                  <span className="block text-ink-strong">{t.name}</span>
                  {t.role}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
