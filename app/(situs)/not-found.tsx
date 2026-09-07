import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/site/button-link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl font-bold text-brand">404</p>
      <h1 className="mt-5 text-3xl font-bold text-white">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted-fg">
        Halaman yang Anda cari mungkin sudah dipindahkan atau alamatnya keliru.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg" className="rounded-lg px-6">
          <ArrowLeft className="size-4" />
          Kembali ke Home
        </ButtonLink>
        <ButtonLink
          size="lg"
          variant="outline"
          href="/layanan"
          className="rounded-lg border-line-strong px-6 text-white hover:bg-white/[0.06]"
        >
          Lihat Layanan
        </ButtonLink>
      </div>
    </section>
  );
}
