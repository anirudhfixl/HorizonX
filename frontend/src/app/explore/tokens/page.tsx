import { redirect } from "next/navigation";

/**
 * Cross-module token discovery route (/explore/tokens).
 * Safely consolidated with the canonical Token Directory (/tokens)
 * while preserving all search, filter, and pagination query parameters.
 */
export default async function ExploreTokensPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const params = new URLSearchParams();

  for (const [key, val] of Object.entries(sp)) {
    if (typeof val === "string") {
      params.set(key, val);
    } else if (Array.isArray(val)) {
      val.forEach((v) => params.append(key, v));
    }
  }

  const query = params.toString();
  redirect(query ? `/tokens?${query}` : "/tokens");
}
