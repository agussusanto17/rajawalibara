import Link from "next/link";
import { wajibMasuk } from "@/lib/cms/sesi";
import { Logo } from "@/components/site/logo";
import { TombolKeluar } from "@/components/cms/tombol-keluar";
import { NavAdmin } from "@/components/cms/nav-admin";

/**
 * Shell panel, sekaligus penjaga sesi.
 *
 * Route group (panel) memisahkan bagian ini dari /admin/masuk. Kalau penjaga
 * dipasang di layout /admin, halaman masuk ikut terjaga dan pengalihannya
 * berputar tanpa henti.
 *
 * Penjaga di sini TIDAK menggantikan penjaga di tiap aksi tulis: aksi server
 * bisa dipanggil langsung tanpa layout ini pernah dirender.
 */
export const MENU = [
  { href: "/admin", label: "Ringkasan", ikon: "Home" },
  { href: "/admin/artikel", label: "Artikel", ikon: "FileText" },
  { href: "/admin/kategori", label: "Kategori", ikon: "Tags" },
  { href: "/admin/produk", label: "Komoditas", ikon: "Package" },
  { href: "/admin/tim", label: "Tim", ikon: "Users" },
  { href: "/admin/halaman", label: "Isi halaman", ikon: "LayoutTemplate" },
  { href: "/admin/layanan", label: "Layanan", ikon: "Briefcase" },
  { href: "/admin/mitra", label: "Klien & mitra", ikon: "Handshake" },
  { href: "/admin/media", label: "Media", ikon: "Gambar" },
  { href: "/admin/pesan", label: "Pesan masuk", ikon: "Inbox" },
  { href: "/admin/pengaturan", label: "Pengaturan", ikon: "Settings" },
] as const;

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await wajibMasuk();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-6 p-5">
          <Link href="/admin" className="shrink-0">
            <Logo compact alt="Rajawali Bara, ringkasan CMS" />
          </Link>

          <NavAdmin menu={MENU} />

          <div className="mt-auto border-t border-line pt-4">
            <p className="truncate text-sm font-medium text-white">
              {s.user.name}
            </p>
            <p className="truncate text-xs text-muted-fg">{s.user.email}</p>
            <TombolKeluar />
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
