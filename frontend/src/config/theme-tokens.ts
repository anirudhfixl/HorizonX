export type RouteTheme = "home" | "tokens";

/**
 * HorizonX intentionally has two route-level visual themes:
 * - Home: soft purplish-blue observatory atmosphere.
 * - Every other route: warm graphite application theme.
 *
 * Keep this routing decision centralized so shared components (including the
 * footer) inherit the active route palette through semantic CSS variables.
 */
export function getRouteTheme(pathname?: string | null): RouteTheme {
  return pathname === "/" ? "home" : "tokens";
}
