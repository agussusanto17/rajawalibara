import type { Product } from "@/lib/site";

/**
 * Tabel perbandingan spesifikasi seluruh tingkatan.
 *
 * Bentuk ini menggantikan halaman detail per tingkatan. Alasannya bukan
 * penghematan: yang dilakukan bagian pengadaan saat memilih batubara adalah
 * MEMBANDINGKAN — kalori naik berapa, moisture turun berapa, sulfur masih di
 * bawah batas boiler atau tidak. Empat halaman terpisah memaksa perbandingan
 * itu dikerjakan di kepala atau disalin ke spreadsheet sendiri; satu tabel
 * menjawabnya dalam satu pandangan.
 *
 * <table> sungguhan, bukan kisi div: pembaca layar mengumumkan nama kolom di
 * tiap sel, dan menyalin isinya ke spreadsheet — yang memang dilakukan bagian
 * pengadaan — hanya bekerja pada tabel sungguhan.
 */
export function TabelSpesifikasi({ tingkatan }: { tingkatan: Product[] }) {
  /**
   * Daftar parameter, urut kemunculan pertama.
   *
   * Diambil dari gabungan seluruh tingkatan, bukan dari tingkatan pertama
   * saja: satu tingkatan yang punya parameter tambahan akan kehilangan
   * barisnya kalau daftarnya diambil dari satu entri.
   */
  const parameter: string[] = [];
  for (const t of tingkatan) {
    for (const s of t.specs) {
      if (!parameter.includes(s.parameter)) parameter.push(s.parameter);
    }
  }

  const cari = (t: Product, p: string) => t.specs.find((s) => s.parameter === p);

  /**
   * Satuan naik ke kolom parameter bila seluruh tingkatan memakai satuan yang
   * sama untuk baris itu — dan hampir selalu begitu.
   *
   * Mengulang "kcal/kg" empat kali dalam satu baris membuat angkanya, yang
   * justru ingin dibandingkan, harus dicari di antara teks yang identik.
   */
  const satuanBersama = (p: string) => {
    const semua = tingkatan
      .map((t) => cari(t, p)?.satuan?.trim())
      .filter((x): x is string => Boolean(x));
    if (semua.length !== tingkatan.length) return null;
    return semua.every((x) => x === semua[0]) ? semua[0] : null;
  };

  // Kolom parameter menempel saat tabel digeser ke samping di layar sempit.
  // Tanpa itu, menggeser ke kolom keempat berarti kehilangan nama barisnya.
  const kolomKiri =
    "sticky left-0 z-10 bg-background text-left align-top";

  return (
    // Latar eksplisit, bukan diwariskan: kolom parameter yang menempel
    // membawa latarnya sendiri, dan tanpa latar yang sama di wadahnya ia
    // terlihat sebagai jalur yang sedikit lebih gelap membelah tabel.
    <div className="overflow-x-auto rounded-2xl border border-line bg-background">
      <table className="w-full min-w-[38rem] border-collapse text-left sm:min-w-[44rem]">
        <caption className="sr-only">
          Perbandingan spesifikasi {tingkatan.length} tingkatan batubara
        </caption>

        <thead>
          <tr className="border-b border-line bg-surface/60">
            <th
              scope="col"
              className={`${kolomKiri} bg-surface px-4 py-5 font-mono sm:px-6 text-[0.7rem] uppercase tracking-[0.14em] text-muted-fg`}
            >
              Parameter
            </th>
            {tingkatan.map((t) => (
              <th
                key={t.slug}
                scope="col"
                className="px-4 py-5 align-bottom sm:px-6"
              >
                <span className="angka block text-lg font-semibold text-white">
                  {t.name}
                </span>
                <span className="mt-1 block text-xs font-normal text-muted-fg">
                  {t.jenis === "MINERAL" ? "Mineral" : "Batubara"}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {parameter.map((p) => {
            const satuan = satuanBersama(p);
            return (
              <tr key={p} className="border-b border-line/70">
                <th scope="row" className={`${kolomKiri} px-4 py-4 sm:px-6`}>
                  <span className="text-[0.95rem] font-medium text-white/85">
                    {p}
                  </span>
                  {satuan && (
                    <span className="mt-0.5 block font-mono text-[0.7rem] text-muted-fg">
                      {satuan}
                    </span>
                  )}
                </th>
                {tingkatan.map((t) => {
                  const s = cari(t, p);
                  return (
                    <td
                      key={t.slug}
                      // whitespace-nowrap: rentang seperti "4.200 – 4.400"
                      // yang patah jadi dua baris berhenti terbaca sebagai
                      // satu nilai, dan di tabel spesifikasi itu perbedaan
                      // yang berarti.
                      className="angka whitespace-nowrap px-4 py-4 text-[0.95rem] font-medium text-white sm:px-6"
                    >
                      {/* Tanda pisah, bukan sel kosong: sel kosong terbaca
                          sebagai tabel yang gagal dimuat, bukan sebagai
                          parameter yang memang tidak berlaku. */}
                      {s ? `${s.nilai}${!satuan && s.satuan ? ` ${s.satuan}` : ""}` : "—"}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {/* Peruntukan ditaruh di baris terakhir, bukan di kepala kolom:
              kalimatnya jauh lebih panjang daripada nama tingkatannya, dan di
              kepala kolom ia mendorong seluruh tabel jadi tinggi sebelum satu
              angka pun terbaca. */}
          <tr>
            <th scope="row" className={`${kolomKiri} px-4 py-5 sm:px-6`}>
              <span className="text-[0.95rem] font-medium text-white/85">
                Peruntukan
              </span>
            </th>
            {tingkatan.map((t) => (
              <td
                key={t.slug}
                className="min-w-[10rem] px-4 py-5 align-top text-[0.95rem] leading-relaxed text-muted-fg sm:px-6"
              >
                {t.audience}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
