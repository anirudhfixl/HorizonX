import { Navigate, useLocation } from "react-router-dom";

/**
 * Cross-module token discovery route (/explore/tokens).
 * Forwards to the Token Explore marketplace (/tokens/explore), keeping any query parameters.
 */
export default function ExploreTokensPage() {
  const { search } = useLocation();
  return <Navigate to={`/tokens/explore${search}`} replace />;
}
