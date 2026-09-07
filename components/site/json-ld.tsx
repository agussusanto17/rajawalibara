/**
 * Menyisipkan structured data ke dalam halaman.
 *
 * `<` di-escape menjadi < supaya string apa pun di dalam data tidak bisa
 * menutup tag <script> lebih awal dan menyuntik markup ke halaman.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
