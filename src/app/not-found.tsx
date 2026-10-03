import Link from "next/link";
import { ArrowRight, BookOpenText, ScanSearch, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center justify-center">
      <div className="hero-fade relative w-full overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,75,91,0.5)] bg-[rgba(77,75,91,0.12)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B89A0]">
            404 · belum digali
          </p>
          <h1 className="font-display mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
            This page is not in the archive.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#8B89A0]">
            The URL exists nowhere we dug. That is an observation, not a
            judgment — absence here is not a claim that nothing lives at this
            address. Honest maps mark what they know.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#0273C4] px-6 text-base font-semibold text-white transition-colors hover:bg-[#0282D8] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Home
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[rgba(77,75,91,0.6)] px-6 text-base font-semibold text-white transition-colors hover:bg-[#15151B] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <BookOpenText className="h-4 w-4" aria-hidden />
              Read the docs
            </Link>
            <Link
              href="/registry"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[rgba(77,75,91,0.6)] px-6 text-base font-semibold text-white transition-colors hover:bg-[#15151B] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <ScanSearch className="h-4 w-4" aria-hidden />
              Search the registry
            </Link>
          </div>
          <p className="mt-8 font-mono text-xs text-[#8B89A0]">
            Looking for a principle? Try the search dialog —{" "}
            <Search className="inline h-3 w-3 translate-y-[-1px]" aria-hidden />
            <span className="sr-only">the search icon</span> in the navigation
            bar.
          </p>
        </div>
      </div>
    </main>
  );
}
