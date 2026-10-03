import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { sourceId } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { PrincipleMeta } from "@/components/principle-meta";
import { PageLanguages } from "@/components/page-languages";
import type { Metadata } from "next";

export function generateStaticParams() {
  return sourceId.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const page = sourceId.getPage((await params).slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description ?? page.data.summary,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const page = sourceId.getPage((await params).slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ enabled: page.data.toc.length > 0 }}
      footer={{
        children: (
          <p className="text-sm text-fd-muted-foreground">
            Principai — lapisan tambahan, bukan pengganti kontrol teknis.
            Kata status yang dipakai perpustakaan ini: <em>sudah digali</em>,
            <em>belum digali</em>, <em>tidak yakin</em>. Tidak ada klaim
            kelengkapan.
          </p>
        ),
      }}
    >
      <PageLanguages current="id" slug={page.slugs} />
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
      <MDX components={getMDXComponents()} />
    </DocsPage>
  );
}
