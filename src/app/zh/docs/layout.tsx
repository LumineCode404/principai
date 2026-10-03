import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Github } from "lucide-react";
import { sourceZh } from "@/lib/source";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={sourceZh.pageTree}
      nav={{
        title: (
          <span className="font-display flex items-center gap-2 font-extrabold text-white">
            <img
              src="/images/logo-icon-48.png"
              alt=""
              width={24}
              height={24}
              className="rounded-md"
            />
            Principai
          </span>
        ),
        url: "/zh",
        transparentMode: "top",
        children: <LanguageSwitcher current="zh" />,
      }}
      links={[
        {
          type: "icon",
          label: "GitHub repository",
          text: "GitHub",
          href: "https://github.com/LumineCode404/principai",
          icon: <Github aria-hidden className="size-5" />,
        },
      ]}
      sidebar={{
        collapsible: false,
        banner: (
          <div
            key="principai-sidebar-banner-zh"
            className="mb-2 rounded-lg border border-[rgba(2,130,216,0.3)] bg-[rgba(2,130,216,0.06)] px-3 py-2 text-xs leading-relaxed text-[#8B89A0]"
          >
            <span className="font-semibold text-[#5CB3F2]">给 AI agent：</span>
            先读 INDEX，遵守 must-follow，只在任务触及时打开其余原则。
          </div>
        ),
      }}
    >
      <div lang="zh">{children}</div>
    </DocsLayout>
  );
}
