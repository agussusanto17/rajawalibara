import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sesi } from "@/lib/cms/sesi";
import { FormMasuk } from "@/components/cms/form-masuk";
import { Logo } from "@/components/site/logo";
import { ColumnGuides } from "@/components/site/decor";
import { Glow, GridLines } from "@/components/site/section";
import { labelVersi } from "@/lib/versi";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false, follow: false },
};

export default async function HalamanMasuk() {
  // Yang sudah masuk tidak perlu melihat formulir ini lagi.
  if (await sesi()) redirect("/admin");

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-5 py-16">
      {/* Latar yang sama dengan hero beranda: cincin yang mengembang dari
          bawah, garis kolom, dan dua glow emas. Dekorasinya aria-hidden dan
          berada di bawah kartu, jadi tidak pernah menghalangi formulir. */}
      <GridLines className="opacity-25" />
      <ColumnGuides className="fade-slow" />
      <Glow className="-top-40 left-1/2 size-[38rem] -translate-x-1/2" />
      <Glow className="-bottom-56 -left-40 size-[34rem]" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="mt-9 text-center text-[2rem] font-semibold leading-tight text-white sm:text-[2.25rem]">
            Masuk ke CMS
          </h1>
          <p className="mt-3 max-w-sm text-center text-base leading-relaxed text-muted-fg">
            Panel pengelolaan konten PT Rajawali Bara Yudha Perkasa.
          </p>
        </div>

        {/* Kartu diberi latar semi dan blur supaya formulirnya tetap terbaca
            di atas cincin yang bergerak. Tanpa itu teks isian bertabrakan
            dengan garis yang lewat di belakangnya. */}
        <div className="mt-9 rounded-2xl border border-line-strong bg-surface/70 p-6 backdrop-blur-xl sm:p-8">
          <FormMasuk />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="max-w-sm text-center text-sm leading-relaxed text-muted-fg">
            Akses diberikan administrator. Belum punya akun, atau lupa
            password? Hubungi pengelola sistem.
          </p>
          <p className="font-mono text-sm text-muted-fg/60">
            CMS Rajawali Bara {labelVersi}
          </p>
        </div>
      </div>
    </main>
  );
}
