import type { Metadata } from "next";
import { HubungiKami, metaHubungiKami } from "@/components/halaman/hubungi-kami";
import { canonical } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaHubungiKami("en");
  return {
    title: m.judul,
    description: m.deskripsi,
    ...canonical(m.jalur),
    openGraph: { type: "website", url: m.jalur, title: m.judul },
  };
}

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return <HubungiKami bahasa="en" />;
}
