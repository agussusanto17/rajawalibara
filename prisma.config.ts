// Muat .env.local dan .env secara native (Node.js 20.12+) tanpa dependensi pihak ketiga
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
  try {
    process.loadEnvFile(".env");
  } catch {}
}
const config = {
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Cadangan hanya supaya perintah yang tidak menyentuh basis data
    // (`prisma generate`, `prisma validate`) tetap jalan tanpa .env.
    url:
      process.env.DATABASE_URL ||
      "mysql://root:root@localhost:3306/dummy_db",
  },
};

export default config;
