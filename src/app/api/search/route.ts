import { createFromSource } from "fumadocs-core/search/server";
import { source, sourceId, sourceZh } from "@/lib/source";

/**
 * Merged tri-lingual search endpoint.
 *
 * The default fumadocs search dialog sends `query`; we fan it out to all three
 * language trees (EN, ID, ZH) and merge the ranked results. A Chinese query
 * surfaces Chinese pages, an English query surfaces English pages — and a
 * user typing in the wrong language still finds the right principle.
 */
export const dynamic = "force-dynamic";

const enSearch = createFromSource(source);
const idSearch = createFromSource(sourceId);
const zhSearch = createFromSource(sourceZh);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? url.searchParams.get("q");
  if (!query) return Response.json([]);

  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;
  const options = {
    locale: null,
    tag: undefined as string[] | undefined,
    limit,
  };

  const [en, id, zh] = await Promise.all([
    enSearch.search(query, options),
    idSearch.search(query, options),
    zhSearch.search(query, options),
  ]);

  // Interleave so no language monopolises the top of the list; fumadocs
  // sorts the merged array client-side by its own ranking fields anyway.
  const merged: typeof en = [];
  const maxLen = Math.max(en.length, id.length, zh.length);
  for (let i = 0; i < maxLen; i++) {
    if (en[i]) merged.push(en[i]);
    if (zh[i]) merged.push(zh[i]);
    if (id[i]) merged.push(id[i]);
  }

  return Response.json(merged);
}
