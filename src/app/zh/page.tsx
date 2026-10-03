"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, AudioLines, BookOpenText, Languages } from "lucide-react";
import { registryStats } from "@/data/registry";
import { Reveal, Stagger, Item, Lift, HeroSpotlight } from "@/components/motion";

const categories = [
  { name: "安全 Security", desc: "限定授权范围、校验输入、默认关闭。", href: "/zh/docs/principles/security" },
  { name: "可靠性 Reliability", desc: "让失败保持小、可见、可恢复。", href: "/zh/docs/principles/reliability" },
  { name: "数据 Data", desc: "能恢复的备份、可逆的删除。", href: "/zh/docs/principles/data" },
  { name: "架构 Architecture", desc: "边界、依赖、从简单起点生长。", href: "/zh/docs/principles/architecture" },
  { name: "API", desc: "显式、版本化、诚实的契约。", href: "/zh/docs/principles/api" },
  { name: "设计 Design", desc: "简单性与支配度量的定律。", href: "/zh/docs/principles/design" },
];

export default function HomeZh() {
  const stats = registryStats();

  return (
    <main id="main" className="flex-1">
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
                alt="Principai 徽标：一只羽毛由源代码构成的猫头鹰，在黑色背景上展示力量"
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
                软件工程原则库
              </p>
            </div>
            <h1 className="font-display mt-5 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl">
              <span className="hero-up block" style={{ ["--d" as never]: "0.05s"} }>
                <span className="block">面向 AI agent 的</span>
              </span>
              <span className="hero-up block" style={{ ["--d" as never]: "0.12s"} }>
                <span className="block">
                  公开<span className="text-brand">原则</span>图书馆。
                </span>
              </span>
            </h1>
            <div className="hero-up" style={{ ["--d" as never]: "0.2s"} }>
              <p className="mt-6 text-lg leading-relaxed text-[#8B89A0]">
                32 条软件工程原则，全部有完整中文翻译——每条原则一个文件，固定章节顺序，
                severity 分级，并带语音摘要。原则建议，控制执法；这是整座图书馆的地基。
              </p>
            </div>
            <div className="hero-up" style={{ ["--d" as never]: "0.28s"} }>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Lift>
                  <Link
                    href="/zh/docs"
                    className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-6 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                    prefetch={false}
                  >
                    进入中文档案
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
                    浏览注册表（英文）
                  </Link>
                </Lift>
              </div>
            </div>
            <div className="hero-up" style={{ ["--d" as never]: "0.36s"} }>
              <p className="mt-6 font-mono text-xs text-[#8B89A0]">
                读 INDEX → 遵守 must-follow → 核实 critical → 破坏性操作前停下
              </p>
              <p className="mt-3 font-mono text-xs text-[#8B89A0]">
                中文
                <span aria-hidden className="mx-2">·</span>
                <Link href="/" prefetch={false} className="text-[#5CB3F2] transition-colors hover:text-white">English</Link>
                <span aria-hidden className="mx-2">·</span>
                <Link href="/id" prefetch={false} className="text-[#5CB3F2] transition-colors hover:text-white">Bahasa Indonesia</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Voice ================= */}
      <section aria-labelledby="voice-heading" className="border-t border-[rgba(77,75,91,0.35)] bg-[#0A0A0D]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Reveal y={12}>
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
              <span aria-hidden className="text-[#8B89A0]">01</span>
              <span aria-hidden className="h-px w-8 bg-[#4D4B5B]/70" />
              中文区专属
            </p>
          </Reveal>
          <Reveal y={16}>
            <h2 id="voice-heading" className="font-display mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              每条原则，都可以用耳朵读。
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              中文是唯一带语音的语言：在每条原则页面点击「听本原则」，即可播放由摘要生成的中文语音。
              越接近母语的语言，越值得用耳朵校对一遍。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.06)] p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(2,130,216,0.15)]">
                <AudioLines className="h-6 w-6 text-[#5CB3F2]" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-white">32 段语音摘要 · 每条原则一段</p>
                <p className="mt-0.5 text-sm text-[#8B89A0]">
                  示例：
                  <Link
                    href="/zh/docs/principles/security/least-authority"
                    prefetch={false}
                    className="text-[#5CB3F2] underline decoration-[#5CB3F2]/40 underline-offset-4 transition-colors hover:decoration-[#5CB3F2]"
                  >
                    最小权限 · Least Authority
                  </Link>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Archive ================= */}
      <section aria-labelledby="archive-heading" className="border-t border-[rgba(77,75,91,0.35)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <Reveal y={12}>
            <p className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0282D8]">
              <span aria-hidden className="text-[#8B89A0]">02</span>
              <span aria-hidden className="h-px w-8 bg-[#4D4B5B]/70" />
              档案
            </p>
          </Reveal>
          <Reveal y={16}>
            <h2 id="archive-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              按类别浏览
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-[#8B89A0] transition-all group-hover:translate-x-0.5 group-hover:text-[#0282D8]"
                      aria-hidden
                    />
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
              <span aria-hidden className="text-[#8B89A0]">03</span>
              <span aria-hidden className="h-px w-8 bg-[#4D4B5B]/70" />
              注册表与诚实规则
            </p>
          </Reveal>
          <Reveal y={16}>
            <h2 id="registry-heading" className="font-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              靠方法穷尽，不靠口号。
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#8B89A0]">
              注册表收录 {stats.total} 条经过研究的工程原则、定律、启发法与实践，横跨 18 个领域，每条都带来源。
              这座图书馆不做完整性声明，不设目标数字——状态只用三个词：sudah digali、belum digali、tidak yakin。
            </p>
          </Reveal>
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
            <Item>
              <div className="rounded-2xl border border-[rgba(2,130,216,0.35)] bg-[rgba(2,130,216,0.06)] p-6">
                <p className="font-display text-4xl font-black text-white">{stats.total}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8B89A0]">注册表条目（英文）</p>
              </div>
            </Item>
            <Item>
              <div className="rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6">
                <p className="font-display text-4xl font-black text-white">{stats.dug}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8B89A0]">已深挖成完整页面</p>
              </div>
            </Item>
            <Item>
              <div className="rounded-2xl border border-[rgba(77,75,91,0.4)] bg-[#0E0E12] p-6">
                <p className="font-display text-4xl font-black text-white">32</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8B89A0]">中文翻译全部完成</p>
              </div>
            </Item>
          </Stagger>
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
              让 agent 懂原则的软件，更安全地交付。
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#8B89A0]">
              英文是唯一事实源；中文与印尼语是带哈希漂移检测的从属翻译树。含义只从英文流出，绝不回流。
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Lift>
                <Link
                  href="/zh/docs"
                  className="glow-brand inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-7 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                  prefetch={false}
                >
                  打开中文文档
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
