import { NextResponse, type NextRequest } from "next/server";

/**
 * Meneruskan jalur permintaan sebagai header.
 *
 * Layout akar memegang elemen <html>, dan atribut `lang`-nya harus mengikuti
 * bahasa halaman. Layout server tidak bisa membaca jalur yang sedang dibuka —
 * `usePathname` hanya ada di komponen peramban, dan menebak dari header
 * Accept-Language menyajikan halaman Indonesia dengan penanda bahasa Inggris
 * kepada pembaca yang justru sedang membuka /en.
 *
 * Header inilah jembatannya. Nilainya berasal dari Next, bukan dari
 * pengunjung: header bernama sama yang dikirim peramban ditimpa di sini.
 */
export function middleware(request: NextRequest) {
  const header = new Headers(request.headers);
  header.set("x-jalur", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: header } });
}

export const config = {
  /* Aset statis dan berkas unggahan dilewati: keduanya tidak pernah dirender
     sebagai halaman, dan melewatkannya menghemat satu lintasan middleware
     pada setiap gambar. */
  matcher: ["/((?!_next/static|_next/image|media/|favicon.ico).*)"],
};
