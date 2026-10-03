import Link from "next/link";

/**
 * Global site footer — sticky to bottom via root layout flex column.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[rgba(77,75,91,0.35)] bg-[#070707]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-icon-96.png"
              alt="Principai owl logo"
              width={44}
              height={44}
              className="rounded-lg"
              loading="lazy"
            />
            <div>
              <p className="font-display text-lg font-extrabold leading-tight text-white">
                Principai
              </p>
              <p className="text-sm text-[#8B89A0]">
                Principles are advisors. Controls are the enforcement.
              </p>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/docs"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              Documentation
            </Link>
            <Link
              href="/registry"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              Registry
            </Link>
            <Link
              href="/docs/principles"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              Principles
            </Link>
            <Link
              href="/docs/profiles"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              Profiles
            </Link>
            <Link
              href="/docs/evals"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              Evals
            </Link>
            <Link
              href="/zh"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              中文
            </Link>
            <Link
              href="/id"
              className="text-[#8B89A0] transition-colors hover:text-white"
            >
              Bahasa Indonesia
            </Link>
            <a
              href="/llms.txt"
              className="font-mono text-[13px] text-[#8B89A0] transition-colors hover:text-white"
            >
              llms.txt
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[rgba(77,75,91,0.35)] pt-6 text-sm sm:flex-row sm:items-center">
          <p className="text-[#8B89A0]">
            © {new Date().getFullYear()} Principai. This library is an additional layer — it does
            not replace technical controls.
          </p>
          <a
            href="mailto:luminecode@proton.me"
            className="inline-flex items-center gap-1.5 font-medium text-[#5CB3F2] transition-colors hover:text-white"
          >
            luminecode@proton.me
          </a>
        </div>
      </div>
    </footer>
  );
}
