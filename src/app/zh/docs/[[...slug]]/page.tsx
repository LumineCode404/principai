import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { sourceZh } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { PrincipleMeta } from "@/components/principle-meta";
import { PageLanguages } from "@/components/page-languages";
import { VoiceSummary } from "@/components/voice-summary";
import type { Metadata } from "next";

export function generateStaticParams() {
  return sourceZh.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const page = sourceZh.getPage((await params).slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description ?? page.data.summary,
    alternates: {
      canonical: `https://principai.vercel.app/zh/docs`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const page = sourceZh.getPage((await params).slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ enabled: page.data.toc.length > 0 }}
      footer={{
        children: (
          <p className="text-sm text-fd-muted-foreground">
            Principai——一层补充，不是技术控制的替代品。本库使用的状态词：
            <em>sudah digali</em>（已深挖）、<em>belum digali</em>（尚未深挖）、
            <em>tidak yakin</em>（不确定）。不做完整性声明。
          </p>
        ),
      }}
    >
      <PageLanguages current="zh" slug={page.slugs} />
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
        {page.data.title}
      </h1>
      {page.data.category ? (
        <PrincipleMeta
          category={page.data.category}
          type={page.data.type}
          severity={page.data.severity}
          status={page.data.status}
          verification={page.data.verification}
          tags={page.data.tags}
        />
      ) : null}
      {page.data.category ? (
        <VoiceSummary
          slug={String(page.data.id ?? page.slugs[page.slugs.length - 1])}
          summary={page.data.summary}
        />
      ) : null}
      <MDX components={getMDXComponents()} />
    </DocsPage>
  );
}
