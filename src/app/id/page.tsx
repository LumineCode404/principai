"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Languages } from "lucide-react";
import { registryStats } from "@/data/registry";
import { Reveal, Stagger, Item, Lift, HeroSpotlight } from "@/components/motion";

const categories = [
  { name: "Keamanan", desc: "Scoping otoritas, validasi input, gagal tertutup.", href: "/id/docs/principles/security", ready: "8 dari 8" },
  { name: "Keandalan", desc: "Kegagalan yang kecil, terlihat, dan pulih.", href: "/id/docs/principles/reliability", ready: "6 dari 6" },
  { name: "Data", desc: "Backup yang teruji, delete yang reversibel.", href: "/id/docs/principles/data", ready: "4 dari 4" },
  { name: "Desain", desc: "Simplicity, duplikasi, dan hukum metrik.", href: "/id/docs/principles/design", ready: "6 dari 6" },
  { name: "API", desc: "Contract eksplisit dan janji kepada orang asing.", href: "/id/docs/principles/api", ready: "4 dari 4" },
  { name: "Arsitektur", desc: "Gaya yang membentuk sistem, bukan cetak biru.", href: "/id/docs/principles/architecture", ready: "4 dari 4" },
  { name: "Testing", desc: "Bukti dengan ekonomi — bentuk suite, perilaku di atas implementasi.", href: "/id/docs/principles/testing", ready: "6 dari 6" },
];

export default function HomeId() {
  const stats = registryStats();

  return (
    <main id="main" className="flex-1" lang="id">
      {/* ================= Hero ================= */}
      <section className="hero-fade relative overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(closest-side, #0282D8, transparent)" }}
          aria-hidden
        />
        <HeroSpotlight />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-16 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-24">
          <div className="logo-blend order-1 w-56 shrink-0 sm:w-64 lg:order-0 lg:w-[24rem]">
            <motion.div
              initial={false}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
            >
              <Image
                src="/images/logo.webp"
                alt="Logo Principai: burung hantu dengan bulu dari source code, menunjukkan kekuatan di atas latar hitam"
                width={880}
                height={880}
                priority
                sizes="(max-width: 1024px) 224px, 384px"
                className="h-auto w-full"
              />
            </motion.div>
          </div>
          <div className="order-2 max-w-2xl text-center lg:order-1 lg:text-left">
            <div className="hero-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.08)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#5CB3F2]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#0282D8]" />
                Perpustakaan prinsip rekayasa perangkat lunak
              </p>
            </div>
            <h1 className="font-display mt-5 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl">
              <span className="hero-up block" style={{ ["--d" as never]: "0.05s"} }>
                <span className="block">Perpustakaan publik,</span>
              </span>
              <span className="hero-up block" style={{ ["--d" as never]: "0.12s"} }>
                <span className="block">
                  dikurasi untuk <span className="text-brand">AI agent.</span>
                </span>
              </span>
            </h1>
            <div className="hero-up" style={{ ["--d" as never]: "0.2s"} }>
              <p className="mt-6 text-lg leading-relaxed text-[#8B89A0]">
                Prinsip rekayasa perangkat lunak dalam format yang ramah AI agent — satu
                prinsip satu file, staged loading, severity bertingkat. Semua {stats.dug} prinsip
                sudah diterjemahkan ke bahasa Indonesia (status draf, menunggu tinjauan
                manusia). Prinsip menasihati, kontrol teknis yang menegakkan.
              </p>
            </div>
            <div className="hero-up" style={{ ["--d" as never]: "0.28s"} }>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Lift>
                  <Link
                    href="/id/docs"
                    className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-6 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                    prefetch={false}
                  >
                    Masuk arsip Indonesia
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Lift>
                <Lift>
                  <Link
                    href="/registry"
                    className="inline-flex h-12 items-center gap-2 rounded-xl border border-[rgba(77,75,91,0.6)] px-6 text-base font-semibold text-white transition-colors hover:bg-[#15151B]"
                    prefetch={false}
                  >
                    <BookOpenText className="h-4 w-4" aria-hidden />
                    Registry (EN)
                  </Link>
                </Lift>
              </div>
            </div>
            <div className="hero-up" style={{ ["--d" as never]: "0.36s"} }>
              <p className="mt-6 font-mono text-xs text-[#8B89A0]">
                baca INDEX → patuhi must-follow → verifikasi critical → berhenti sebelum destructive ops
              </p>
              <p className="mt-3 font-mono text-xs text-[#8B89A0]">
                <Link href="/" prefetch={false} className="text-[#5CB3F2] transition-colors hover:text-white">English</Link>
                <span aria-hidden className="mx-2">·</span>
                <Link href="/zh" prefetch={false} className="text-[#5CB3F2] transition-colors hover:text-white">中文</Link>
                <span aria-hidden className="mx-2">·</span>
                Bahasa Indonesia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Archive ================= */}
      <section aria-labelledby="archive-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Reveal y={12}>
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
              <span aria-hidden className="text-[#8B89A0]">01</span>
              <span aria-hidden className="h-px w-8 bg-[#4D4B5B]/70" />
              Arsip
            </p>
          </Reveal>
          <Reveal y={16}>
            <h2 id="archive-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Telusuri per kategori
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              Kategori di bawah sudah <em>sudah digali</em>. Semua {stats.dug} prinsip sudah
              diterjemahkan penuh ke bahasa Indonesia; koreksi lanjutan mengikuti arsip
              bahasa Inggris sebagai sumber kebenaran tunggal. Daftar ini bukan janji
              cakupan.
            </p>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <Item key={c.name}>
                <Lift className="h-full">
                  <Link
                    href={c.href}
                    prefetch={false}
                    className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-5 transition-colors hover:border-[rgba(2,130,216,0.5)] hover:bg-[#101017]"
                  >
                    <div>
                      <h3 className="font-display text-base font-bold text-white">{c.name}</h3>
                      <p className="mt-1 text-sm text-[#8B89A0]">{c.desc}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-full border border-[rgba(2,130,216,0.4)] bg-[rgba(2,130,216,0.08)] px-2.5 py-1 font-mono text-[11px] text-[#5CB3F2]">
                        {c.ready}
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-[#8B89A0] transition-all group-hover:translate-x-0.5 group-hover:text-[#0282D8]"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </Lift>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================= Registry + honesty ================= */}
      <section aria-labelledby="registry-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Reveal y={12}>
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
              <span aria-hidden className="text-[#8B89A0]">02</span>
              <span aria-hidden className="h-px w-8 bg-[#4D4B5B]/70" />
              Registry &amp; aturan kejujuran
            </p>
          </Reveal>
          <Reveal y={16}>
            <h2 id="registry-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ekshaustif dengan metode, bukan dengan slogan.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              Registry memuat {stats.total} prinsip, hukum, heuristik, dan praktik hasil
              riset di 18 domain — setiap entri membawa sumbernya. Perpustakaan ini tidak
              membuat klaim kelengkapan dan tidak memasang angka target; status hanya
              <em> sudah digali</em>, <em>belum digali</em>, <em>tidak yakin</em>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-[rgba(77,75,91,0.35)]">
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{ background: "radial-gradient(60% 60% at 50% 100%, #0282D8, transparent)" }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-24 text-center sm:px-6">
          <Reveal y={14}>
            <Languages className="mx-auto h-8 w-8 text-[#0282D8]" aria-hidden />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="cta-heading" className="font-display mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Kirim perangkat lunak yang lebih aman bersama agent yang tahu.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8B89A0]">
              Bahasa Inggris adalah sumber kebenaran tunggal; bahasa Indonesia dan Mandarin
              adalah pohon turunan dengan deteksi drift berbasis hash. Arti mengalir satu arah.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Lift>
                <Link
                  href="/id/docs"
                  className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-7 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                  prefetch={false}
                >
                  Buka dokumentasi
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Lift>
              <Lift>
                <Link
                  href="/"
                  className="inline-flex h-12 items-center rounded-xl border border-[rgba(77,75,91,0.6)] px-7 text-base font-semibold text-white transition-colors hover:bg-[#15151B]"
                  prefetch={false}
                >
                  English site
                </Link>
              </Lift>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
