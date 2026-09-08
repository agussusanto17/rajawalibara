import type { Metadata } from "next";
import { Layanan, metaLayanan } from "@/components/halaman/layanan";
import { canonical } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const m = await metaLayanan("en");
  return {
    title: m.judul,
    description: m.deskripsi,
    ...canonical(m.jalur),
    openGraph: { type: "website", url: m.jalur, title: m.judul },
  };
}

export const dynamic = "force-dynamic";

export default function ServicesPage() {
  return <Layanan bahasa="en" />;
}
