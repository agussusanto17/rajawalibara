import type { Metadata } from "next";
import { TentangKami, metaTentangKami } from "@/components/halaman/tentang-kami";
import { canonical } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaTentangKami("id");
  return {
    title: m.judul,
    description: m.deskripsi,
    // Menimpa canonical "/" yang diwarisi dari layout root.
    ...canonical(m.jalur),
    openGraph: { type: "website", url: m.jalur, title: m.judul },
  };
}

export const dynamic = "force-dynamic";

export default function HalamanTentangKami() {
  return <TentangKami bahasa="id" />;
}
