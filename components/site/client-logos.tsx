import { logoMitra, namaMitra, profil } from "@/lib/konten";
import { Marquee } from "@/components/site/marquee";
import { LogoMitra, TIP_GELAP, TIP_TERANG } from "@/components/site/logo-mitra";
import { Reveal } from "@/components/site/reveal";

/**
 * Strip kepercayaan di atas section Layanan. Selalu berjalan, bukan deretan
 * diam, supaya tetap hidup walau jumlah logonya sedikit.
 *
 * Tiga keadaan, bukan dua:
 *
 *   ada logo   — logonya yang berjalan;
 *   ada nama   — namanya berjalan sebagai teks. Nama klien sudah tercatat dari
 *                company profile sementara berkas logonya belum diunggah, dan
 *                nama sungguhan jauh lebih meyakinkan daripada tujuh kotak
 *                putus-putus bertuliskan "Logo mitra";
 *   kosong     — slot bertanda.
 *
 * Yang TIDAK pernah dilakukan: menempelkan logo yang tidak diberikan. Itu
 * klaim kemitraan, dan yang membacanya justru pihak yang bisa mengeceknya.
 */
export async function ClientLogos({ terang = false }: { terang?: boolean }) {
  const [clientLogos, nama, company] = await Promise.all([
    logoMitra(),
    namaMitra(),
    profil(),
  ]);
  const hasLogos = clientLogos.length > 0;
  // Dipakai di dua latar. Warna dan tepi lembutnya ikut, bukan dipaksa gelap.
  const t = terang
    ? {
        section: "bg-white py-16 text-ink-strong sm:py-20",
        teks: "text-ink-strong/65",
        slot: "border-ink-strong/20",
        slotTeks: "text-ink-strong/45",
        kiri: "from-white",
        kanan: "from-white",
        tip: TIP_TERANG,
      }
    : {
        section: "border-b border-line py-16 sm:py-20",
        teks: "text-muted-fg",
        slot: "border-line-strong",
        slotTeks: "text-muted-fg/70",
        kiri: "from-background",
        kanan: "from-background",
        tip: TIP_GELAP,
      };
  const slots = hasLogos
    ? clientLogos
    : nama.length > 0
      ? nama.map((n) => ({ name: n.name, src: null }))
      : Array.from({ length: 7 }, () => null);

  return (
    <section className={t.section}>
      <div className="shell">
        <Reveal>
          <p className={`flex items-center justify-center gap-2.5 text-sm ${t.teks}`}>
            <span className="size-2.5 rounded-sm bg-brand" />
            Dipercaya {company.clientCount} perusahaan di sektor industri dan
            energi
          </p>
        </Reveal>
      </div>

      {/* Di luar `.shell`: strip berjalan dari tepi ke tepi layar. */}
      <div className="relative mt-10">
        <Marquee speed={30} jedaSaatHover className="py-11">
          {slots.map((c, i) =>
            c && c.src ? (
              <LogoMitra key={c.name} nama={c.name} src={c.src} tip={t.tip} />
            ) : c ? (
              <span
                key={c.name}
                className={`flex h-16 shrink-0 items-center whitespace-nowrap px-6 text-sm font-semibold sm:h-20 ${t.teks}`}
              >
                {c.name}
              </span>
            ) : (
              <div
                key={i}
                className={`flex h-16 w-40 shrink-0 items-center justify-center rounded-lg border border-dashed sm:h-20 sm:w-48 ${t.slot}`}
              >
                <span className={`text-xs ${t.slotTeks}`}>Logo mitra</span>
              </div>
            ),
          )}
        </Marquee>

        {/* Tepi kiri dan kanan dilembutkan agar strip tidak terpotong mendadak. */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r to-transparent sm:w-28 ${t.kiri}`}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l to-transparent sm:w-28 ${t.kanan}`}
        />
      </div>
    </section>
  );
}
