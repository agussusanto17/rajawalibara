/**
 * Mengirim event ke dataLayer GTM.
 *
 * Semua tag berjalan dari dalam GTM, jadi berkas ini tidak pernah menyentuh
 * GA4 atau Meta Pixel secara langsung: ia hanya menaruh event, dan GTM yang
 * memutuskan tag mana yang menanggapinya. Menambah tujuan baru nanti cukup
 * dilakukan di dashboard GTM, tanpa deploy.
 *
 * Aman dipanggil kapan pun. Di staging GTM tidak dipasang, sehingga dataLayer
 * hanya menampung event yang tidak dibaca siapa pun — bukan galat. Karena itu
 * pemanggilnya tidak perlu memeriksa apakah pelacakan sedang aktif.
 */
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function kirimEvent(
  nama: string,
  data: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: nama, ...data });
}
