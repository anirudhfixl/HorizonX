export type RouteTheme = "tokens";

/**
 * HorizonX uses one unified dark visual system across the application.
 * Route-specific layouts may vary, but the global canvas and semantic
 * surfaces inherit the Token ecosystem's warm graphite palette.
 */
export function getRouteTheme(_pathname?: string | null): RouteTheme {
  return "tokens";
}
