import React from "react";
import { Button } from "@/components/ui/button";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary shadow-xl shadow-primary/10">
        <Compass className="h-10 w-10 animate-spin [animation-duration:8s]" />
      </div>

      <div className="mt-6 space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          Error 404
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          The requested route does not exist or has been relocated within the HorizonX ecosystem.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="sm" className="bg-primary text-primary-foreground font-semibold px-4 gap-2">
          <Link to="/">
            <Home className="h-4 w-4" /> Return to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="border-border/60 gap-2">
          <Link to="/explore">
            <Compass className="h-4 w-4" /> Explore Ecosystem
          </Link>
        </Button>
      </div>

      <div className="mt-12 rounded-xl border border-border/50 bg-secondary/20 p-4 text-left max-w-md w-full">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
          Suggested Destinations:
        </p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li>
            <Link to="/tokens" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3 rotate-180 text-primary" /> Token Dashboard & Creation
            </Link>
          </li>
          <li>
            <Link to="/launchpad" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3 rotate-180 text-primary" /> Presales & Fair Launches
            </Link>
          </li>
          <li>
            <Link to="/airdrops" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3 rotate-180 text-primary" /> Airdrop Campaigns & Claims
            </Link>
          </li>
          <li>
            <Link to="/staking" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ArrowLeft className="h-3 w-3 rotate-180 text-primary" /> Staking Pools & Yield
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
