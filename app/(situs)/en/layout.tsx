import { KerangkaSitus } from "@/components/site/kerangka";

/** Cabang bahasa Inggris, seluruhnya di bawah /en. */
export default function LayoutInggris({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KerangkaSitus bahasa="en">{children}</KerangkaSitus>;
}
