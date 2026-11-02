import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top on route changes (Next.js did this automatically). Query-string-only changes keep scroll. */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
