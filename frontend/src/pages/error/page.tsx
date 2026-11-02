import { useEffect } from "react";
import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

/** Route error boundary (React Router `errorElement`). Replaces Next.js `error.tsx`. */
export default function GlobalError() {
  const error = useRouteError();

  useEffect(() => {
    // Log exception for audit telemetry
    console.error("Runtime exception caught by boundary:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-lg">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
        Something Went Wrong
      </h1>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
        An unexpected error occurred while rendering this module. You can retry the action or return to the platform dashboard.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button size="sm" onClick={() => window.location.reload()} className="gap-2 text-xs font-semibold">
          <RefreshCw className="h-3.5 w-3.5" /> Try Again
        </Button>
        <Button asChild size="sm" variant="outline" className="gap-2 text-xs border-border/60">
          <Link to="/">
            <Home className="h-3.5 w-3.5" /> Home Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
