import type { Metadata } from "next";
import { HubungiKami, metaHubungiKami } from "@/components/halaman/hubungi-kami";
import { canonical } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaHubungiKami("id");
  return {
    title: m.judul,
    description: m.deskripsi,
    // Menimpa canonical "/" yang diwarisi dari layout root.
    ...canonical(m.jalur),
    openGraph: { type: "website", url: m.jalur, title: m.judul },
  };
}

export const dynamic = "force-dynamic";

export default function HalamanHubungiKami() {
  return <HubungiKami bahasa="id" />;
}
