import { ArrowUpRight } from "lucide-react";
import { bidangUsaha, daftarKantor, profil } from "@/lib/konten";

/**
 * Pita legalitas — bagian penanda situs ini.
 *
 * Diletakkan tepat di bawah hero, sebelum satu pun kalimat pemasaran, karena
 * inilah pertanyaan pertama pembeli institusional: perusahaan ini nyata atau
 * bukan. Perdagangan batubara di Indonesia penuh perantara yang hanya punya
 * nomor WhatsApp; menaruh nomor izin yang bisa dicek sendiri di baris paling
 * atas menjawab hal itu tanpa satu kata klaim.
 *
 * Semua isinya datum yang bisa diverifikasi pihak lain — NIB di oss.go.id,
 * kode KBLI di lampiran NIB, alamat kantor di akta. Yang TIDAK ditampilkan:
 * NPWP (pengenal pajak, dan menempelkannya di halaman publik mempermudah
 * pemalsuan tagihan atas nama perusahaan) dan skala usaha (label administratif
 * yang justru melemahkan posisi di mata bagian pengadaan, tanpa memberi
 * informasi yang mereka cari).
 *
 * Barisnya dirender hanya bila datanya ada. Kolom kosong berlabel "—" di pita
 * yang isinya soal legalitas terbaca sebagai dokumen yang tidak lengkap.
 */
export async function PitaLegalitas() {
  const [company, kantor, kbli] = await Promise.all([
    profil(),
    daftarKantor(),
    bidangUsaha(),
  ]);

  /** "KBLI 46710 — Perdagangan Besar…" → "46710". Kalau polanya tidak cocok,
   *  butirnya dilewati: menampilkan seluruh kalimat KBLI di sel sesempit ini
   *  membuat pitanya jadi paragraf. */
  const kode = kbli
    .map((n) => n.match(/\b(\d{5})\b/)?.[1])
    .filter((x): x is string => Boolean(x));

  type Baris = {
    label: string;
    nilai: string;
    href?: string;
    catatan?: string;
  };

  const baris: Baris[] = ([
    company.nib ? {
      label: "Nomor Induk Berusaha",
      nilai: company.nib,
      href: "https://oss.go.id",
      catatan: "Cek di oss.go.id",
    } : null,
    kode.length > 0 ? {
      label: "Bidang usaha (KBLI)",
      nilai: kode.join(" · "),
      catatan: "Perdagangan besar bahan bakar padat",
    } : null,
    { label: "Berdiri", nilai: String(company.founded), catatan: "24 Juni 2021" },
    ...kantor.slice(0, 2).map((k) => ({
      label: k.jenis === "PUSAT" ? "Kantor pusat" : "Kantor cabang",
      nilai: k.alamatSingkat,
      catatan: k.telepon ?? undefined,
    })),
  ] as (Baris | null)[]).filter((x): x is Baris => x !== null);

  if (baris.length === 0) return null;

  return (
    <section
      aria-label="Legalitas perusahaan"
      className="border-b border-line bg-surface/40"
    >
      {/* Hairline pemisah, bukan kartu: pita ini meniru lembar dokumen, dan
          dokumen dibagi oleh garis, bukan oleh kotak bersudut membulat. */}
      <dl className="shell grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5">
        {baris.map((b, i) => (
          <div
            key={b.label}
            className={[
              "flex flex-col gap-1.5 py-6 lg:py-7",
              // Garis vertikal hanya di antara sel, tidak di tepi luar.
              i > 0 ? "lg:border-l lg:border-line lg:pl-6" : "",
              i > 0 && i % 2 === 1 ? "sm:border-l sm:border-line sm:pl-6" : "",
            ].join(" ")}
          >
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-fg">
              {b.label}
            </dt>
            <dd className="angka text-[0.95rem] font-medium leading-snug text-white">
              {b.href ? (
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Padding negatif: menambah tinggi sentuh dari 21px ke 41px
                  // tanpa menggeser satu pun baris di sekitarnya.
                  className="group -my-2.5 inline-flex items-baseline gap-1.5 py-2.5 text-brand underline-offset-4 hover:underline"
                >
                  {b.nilai}
                  <ArrowUpRight
                    className="size-3 shrink-0 self-center opacity-60 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                b.nilai
              )}
              {b.catatan && (
                <span className="mt-1 block font-sans text-xs font-normal normal-case tracking-normal text-muted-fg">
                  {b.catatan}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
