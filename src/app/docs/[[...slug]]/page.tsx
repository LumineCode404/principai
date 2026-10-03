import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const page = source.getPage((await params).slug);
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
  const page = source.getPage((await params).slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{ enabled: page.data.toc.length > 0 }}
      footer={{
        children: (
          <p className="text-sm text-fd-muted-foreground">
            PRINCIPAI — an additional layer, not a replacement for technical controls.
            Status words used in this library: <em>sudah digali</em> (dug),{" "}
            <em>belum digali</em> (not yet dug), <em>tidak yakin</em> (unsure). No completeness
            claims.
          </p>
        ),
      }}
    >
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
        {page.data.title}
      </h1>
      <MDX components={getMDXComponents()} />
    </DocsPage>
  );
}
