"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { kirimEvent } from "@/lib/analitik";
import { Turnstile, type TurnstileRef } from "@/components/site/turnstile";

/** Harus sama dengan AKSI_KONTAK di lib/turnstile.ts. */
const AKSI = "kontak";


type Galat = Partial<Record<"nama" | "email" | "telepon" | "pesan", string>>;

/**
 * Isian dipakai di section terang, sedangkan token bawaan komponen bertema
 * gelap. Latar, teks, dan placeholder-nya ditimpa di satu tempat ini supaya
 * tidak tersebar sebagai tambalan di tiap isian.
 */
const DASAR =
  // `md:text-[1.05rem]` wajib ada: komponen Input membawa `md:text-sm`, dan
  // utilitas ber-media-query mengalahkan yang polos berapa pun urutannya.
  "rounded-lg border-transparent bg-ink-strong/[0.05] px-4 text-[1.05rem] text-ink-strong placeholder:text-ink-strong/40 focus-visible:border-gold-ink/40 focus-visible:ring-gold-ink/15 md:text-[1.05rem]";

/** Isian satu baris. */
const ISIAN = `h-[3.25rem] ${DASAR}`;

/** Isian pesan. Tingginya diatur di sini, bukan lewat atribut `rows`:
 *  kelas tinggi apa pun akan menimpanya. */
const ISIAN_PESAN = `min-h-[15rem] py-4 ${DASAR}`;
type Status = "diam" | "mengirim" | "terkirim";

/**
 * Formulir kontak yang benar-benar mengirim.
 *
 * Sebelumnya submit-nya berhenti di `setSent(true)` tanpa memanggil apa pun,
 * sementara layarnya memberi tahu pengirim bahwa pesannya tercatat dan akan
 * dibalas. Sekarang kalimat itu hanya muncul setelah server menjawab berhasil,
 * dan kegagalan ditampilkan apa adanya beserta jalan keluarnya.
 */
/** Daftar produk untuk pilihan "produk yang ditanyakan". Dioper dari server
 *  karena komponen ini berjalan di peramban dan tidak bisa membaca basis data
 *  sendiri. */
export function ContactForm({
  produk,
  whatsappHref,
}: {
  produk: { slug: string; name: string }[];
  /** Datang sebagai props: komponen ini berjalan di peramban dan tidak bisa
   *  membaca basis data sendiri. */
  whatsappHref: string;
}) {
  const [galat, setGalat] = useState<Galat>({});
  const [gagalKirim, setGagalKirim] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("diam");

  // Kunci situs bersifat publik; tanpa nilainya widget dilewati sepenuhnya
  // supaya pengembangan lokal tetap bisa mengirim formulir.
  const kunciSitus = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [tokenTurnstile, setTokenTurnstile] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileRef>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "mengirim") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const ambil = (k: string) => String(data.get(k) ?? "").trim();
    const nama = ambil("nama");
    const email = ambil("email");
    const telepon = ambil("telepon");
    const pesan = ambil("pesan");

    const next: Galat = {};
    if (!nama) next.nama = "Nama wajib diisi.";
    if (!email) next.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Format email belum benar.";
    if (!telepon) next.telepon = "Nomor telepon wajib diisi.";
    else if (telepon.replace(/\D/g, "").length < 9)
      next.telepon = "Nomor telepon belum lengkap.";
    if (!pesan) next.pesan = "Pesan wajib diisi.";
    else if (pesan.length < 10) next.pesan = "Pesan minimal 10 karakter.";

    setGalat(next);
    setGagalKirim(null);
    if (Object.keys(next).length > 0) {
      // Fokus dipindahkan ke isian pertama yang bermasalah, supaya pengguna
      // papan ketik dan pembaca layar tahu harus memperbaiki yang mana.
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("mengirim");
    const q = new URLSearchParams(window.location.search);
    const kampanye = [...q.entries()]
      .filter(([k]) => /^utm_|^gclid$|^fbclid$/i.test(k))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    try {
      const res = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          email,
          telepon,
          organisasi: ambil("organisasi"),
          pesan,
          website: ambil("website"), // umpan bot
          produk: ambil("produk") || q.get("produk") || undefined,
          kampanye: kampanye || undefined,
          halaman: window.location.pathname + window.location.search,
          turnstileToken: tokenTurnstile ?? undefined,
        }),
      });
      const hasil = await res.json().catch(() => ({}));

      // Token sekali pakai. Direset di sini, bukan hanya saat gagal: percobaan
      // berikutnya dari halaman yang sama akan memakai token mati kalau tidak.
      turnstileRef.current?.reset();

      if (!res.ok) {
        if (hasil.galat) setGalat(hasil.galat);
        setGagalKirim(
          hasil.pesan ?? "Pesan gagal terkirim. Silakan coba lagi.",
        );
        setStatus("diam");
        return;
      }
      setStatus("terkirim");

      // Dikirim setelah server menjawab berhasil, bukan saat tombol ditekan:
      // pesan yang gagal terkirim bukan prospek, dan menghitungnya membuat
      // angka konversi lebih besar daripada kenyataannya.
      kirimEvent("generate_lead", {
        form_name: "contact_us_form",
        service_interest: ambil("produk") || q.get("produk") || undefined,
      });
    } catch {
      setGagalKirim(
        "Tidak bisa menghubungi server. Periksa koneksi Anda, atau hubungi kami lewat WhatsApp.",
      );
      setStatus("diam");
    }
  }

  if (status === "terkirim") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-gold-ink/25 bg-gold-ink/[0.06] p-8 text-left">
        <CheckCircle2 className="size-8 text-gold-ink" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-ink-strong">
          Pesan Anda masuk
        </h3>
        <p className="text-[0.95rem] leading-relaxed text-ink-strong/70">
          Terima kasih sudah menghubungi kami. Tim kami membalas melalui email
          dalam 1×24 jam kerja.
        </p>
        <Button
          variant="outline"
          className="mt-2 rounded-lg border-ink-strong/25 bg-transparent text-ink-strong hover:bg-ink-strong/[0.06] hover:text-ink-strong"
          onClick={() => setStatus("diam")}
        >
          Kirim pesan lain
        </Button>
      </div>
    );
  }

  const mengirim = status === "mengirim";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 text-left"
    >
      {gagalKirim && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/[0.07] p-4 text-left text-[0.95rem] leading-relaxed text-ink-strong"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <span>
            {gagalKirim}{" "}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4 hover:text-gold-ink"
            >
              Buka WhatsApp
            </a>
          </span>
        </p>
      )}

      <Field id="nama" label="Nama lengkap" error={galat.nama}>
        <Input
          className={ISIAN}
          id="nama"
          name="nama"
          placeholder="Nama Anda"
          aria-invalid={!!galat.nama}
          aria-describedby={galat.nama ? "nama-error" : undefined}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="Email" error={galat.email}>
          <Input
            className={ISIAN}
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            aria-invalid={!!galat.email}
            aria-describedby={galat.email ? "email-error" : undefined}
          />
        </Field>

        <Field id="telepon" label="Telepon / WhatsApp" error={galat.telepon}>
          <Input
            className={ISIAN}
            id="telepon"
            name="telepon"
            type="tel"
            inputMode="tel"
            placeholder="08xx xxxx xxxx"
            aria-invalid={!!galat.telepon}
            aria-describedby={galat.telepon ? "telepon-error" : undefined}
          />
        </Field>

        <Field id="organisasi" label="Organisasi" optional>
          <Input
            className={ISIAN}
            id="organisasi"
            name="organisasi"
            placeholder="Nama sekolah, dinas, atau perusahaan"
          />
        </Field>

        <Field id="produk" label="Produk yang diminati" optional>
          {/* <select> bawaan peramban, bukan menu buatan sendiri: tetap bekerja
              tanpa JavaScript, sudah aksesibel, dan di ponsel memunculkan
              pemilih bawaan sistem yang jauh lebih enak dipakai. */}
          <select
            id="produk"
            name="produk"
            defaultValue=""
            className={`${ISIAN} w-full appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23080d0d' stroke-opacity='0.45' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">Belum menentukan</option>
            {produk.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
            <option value="lainnya">Lainnya</option>
          </select>
        </Field>
      </div>

      <Field id="pesan" label="Pesan" error={galat.pesan}>
        <Textarea
          className={ISIAN_PESAN}
          id="pesan"
          name="pesan"
          rows={9}
          placeholder="Sebutkan kebutuhan kalori, tonase, jadwal, dan titik serah…"
          aria-invalid={!!galat.pesan}
          aria-describedby={galat.pesan ? "pesan-error" : undefined}
        />
      </Field>

      {kunciSitus && (
        <div>
          <Turnstile
            siteKey={kunciSitus}
            action={AKSI}
            onToken={setTokenTurnstile}
            kendali={turnstileRef}
          />
        </div>
      )}

      {/* Umpan bot. Disembunyikan dari mata dan dari pembaca layar, dan
          dikeluarkan dari urutan tab, jadi hanya mesin yang mengisinya. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Jangan diisi</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-lg"
        disabled={mengirim}
      >
        {mengirim ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Mengirim…
          </>
        ) : (
          <>
            Kirim Pesan
            <Send className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-[1rem] text-ink-strong">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-ink-strong/50">(opsional)</span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
