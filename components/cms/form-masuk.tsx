"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ISIAN =
  "h-11 rounded-lg border-line-strong bg-surface px-3.5 text-[0.95rem] text-white placeholder:text-muted-fg/60 md:text-[0.95rem]";

export function FormMasuk() {
  const router = useRouter();
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [lihat, setLihat] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGalat(null);
    setKirim(true);

    const data = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("sandi") ?? ""),
    });

    if (error) {
      // Pesannya sengaja tidak membedakan "email tidak ada" dari "sandi salah".
      // Membedakannya memberi tahu penebak bahwa sebuah email terdaftar.
      setGalat("Email atau sandi tidak cocok.");
      setKirim(false);
      return;
    }

    // refresh() dulu supaya layout server membaca cookie sesi yang baru,
    // baru berpindah. Tanpa itu /admin bisa dirender dengan sesi lama.
    router.refresh();
    router.push("/admin");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {galat && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {galat}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-[0.95rem] text-white">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={ISIAN}
          placeholder="nama@rajawalibara.co.id"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sandi" className="text-[0.95rem] text-white">
          Password
        </Label>
        <div className="relative">
          <Input
            id="sandi"
            name="sandi"
            type={lihat ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${ISIAN} pr-12`}
          />
          {/* Label tombolnya menyebut tindakan berikutnya, bukan keadaan
              sekarang: "Sembunyikan password" saat sedang terlihat. Menyebut
              keadaan membuat pembaca layar tidak tahu apa yang akan terjadi
              kalau tombolnya ditekan. */}
          <button
            type="button"
            onClick={() => setLihat((v) => !v)}
            aria-pressed={lihat}
            aria-label={lihat ? "Sembunyikan password" : "Tampilkan password"}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-lg text-muted-fg transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {lihat ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={kirim}
        className="mt-2 h-11 rounded-lg text-base"
      >
        {kirim && <Loader2 className="size-4 animate-spin" />}
        {kirim ? "Memeriksa..." : "Masuk"}
      </Button>
    </form>
  );
}
