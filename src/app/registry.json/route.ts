import { REGISTRY, REGISTRY_DOMAINS, registryStats } from "@/data/registry";

/**
 * /registry.json — the machine-readable registry export for AI agents.
 * Pairs with /llms.txt as the exhaustive-by-method catalog.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(
    JSON.stringify(
      {
        name: "Principai Registry",
        description:
          "Research-backed catalog of software engineering principles, laws, heuristics, and practices. No completeness claims; statuses use three words only: sudah digali (dug, full page exists), belum digali (not yet dug), tidak yakin (uncertain attribution).",
        honesty: {
          statusWords: ["sudah digali", "belum digali", "tidak yakin"],
          note: "Absence from this catalog is not a claim that a principle does not exist.",
        },
        stats: registryStats(),
        domains: REGISTRY_DOMAINS,
        entries: REGISTRY.map(({ name, domain, def, src, status, href }) => ({
          name,
          domain,
          definition: def,
          source: src,
          status,
          ...(href ? { page: `https://principai.vercel.app${href}` } : {}),
        })),
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  );
}
