import { ArrowUpRight } from "lucide-react";
import { daftarKantor, profil } from "@/lib/konten";
import type { Bahasa } from "@/lib/bahasa";
import { teks } from "@/lib/teks";

/**
 * Peta lokasi kantor, melebar penuh, dengan daftar seluruh kantor di bawahnya.
 *
 * Memakai sematan Google Maps tanpa kunci API (`output=embed`), jadi tidak ada
 * kredensial yang perlu dijaga dan tidak ada tagihan yang bisa membengkak.
 *
 * Dua cara menunjuk tempat, dan yang dipakai bergantung pada data yang ada:
 *
 *   CID  — menunjuk entri tempat secara langsung. Paling tepat, tetapi hanya
 *          ada untuk tempat yang sudah terdaftar di Google Maps.
 *   Teks — mencari alamatnya. Kurang presisi, tetapi tidak pernah menunjuk
 *          gedung yang salah seperti CID yang ditebak-tebak.
 *
 * Peta hanya menampilkan kantor pusat. Dua iframe berdampingan menarik dua
 * skrip pihak ketiga sekaligus untuk halaman yang sama, dan yang kedua hampir
 * tidak pernah dilihat.
 *
 * `loading="lazy"` disengaja: peta ini berada di bawah halaman, dan memuatnya
 * lebih awal berarti menarik skrip pihak ketiga sebelum pengunjung sampai ke
 * sini.
 */
export async function PetaKantor({ bahasa }: { bahasa: Bahasa }) {
  const t = teks(bahasa);
  const [company, kantor] = await Promise.all([
    profil(bahasa),
    daftarKantor(bahasa),
  ]);
  const pusat = kantor.find((k) => k.jenis === "PUSAT") ?? kantor[0];

  const semat = pusat.mapsCid
    ? `https://maps.google.com/maps?cid=${pusat.mapsCid}&z=17&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(pusat.alamat)}&z=16&output=embed`;

  const arah = (k: (typeof kantor)[number]) =>
    k.mapsCid
      ? `https://maps.google.com/?cid=${k.mapsCid}`
      : `https://maps.google.com/?q=${encodeURIComponent(k.alamat)}`;

  return (
    <section id="peta" className="scroll-mt-24 border-t border-line">
      <div className="relative">
        <iframe
          title={`Peta lokasi ${pusat.nama} ${company.legalName}`}
          src={semat}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[22rem] w-full border-0 sm:h-[30rem]"
        />
      </div>

      <div className="shell grid gap-8 py-10 sm:grid-cols-2">
        {kantor.map((k) => (
          <div key={k.nama} className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-muted-fg">{k.nama}</p>
              <p className="mt-1.5 max-w-md text-base leading-relaxed text-white">
                {k.alamat}
              </p>
              {/* Nomor dan surel hanya dirender bila kantor itu memang
                  punya sendiri. Menurunkannya dari nomor pusat berarti
                  menampilkan kontak yang tidak menghubungi kantor ini. */}
              {(k.telepon || k.email) && (
                <p className="mt-2 text-[0.95rem] text-muted-fg">
                  {[k.telepon, k.email].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            <a
              href={arah(k)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-brand/50 hover:bg-white/[0.06]"
            >
              {t.umum.bukaPetunjukArah}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
