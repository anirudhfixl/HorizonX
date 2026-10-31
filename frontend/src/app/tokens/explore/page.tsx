import { redirect } from "next/navigation";

/**
 * Legacy canonical explorer route (/tokens/explore).
 * Redirects to the canonical Token Directory (/tokens) while preserving
 * all search, filter, and pagination query parameters.
 */
export default async function CanonicalTokenExplorerPage({
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
