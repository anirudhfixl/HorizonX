import React from "react";
import { Activity, BookOpen, FileCode2 } from "lucide-react";
import { Link } from "react-router-dom";

export type TokenDetailTab = "overview" | "contract" | "activity";

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "contract", label: "Contract & source", icon: FileCode2 },
  { id: "activity", label: "Catalog activity", icon: Activity },
] as const;

export function TokenDetailTabs({ tokenId, activeTab }: { tokenId: string; activeTab: TokenDetailTab }) {
  return (
    <nav aria-label="Token detail pages" className="tk-detail-tabs">
      {tabs.map(({ id, label, icon: Icon }) => (
        <Link
          key={id}
          to={id === "overview" ? `/tokens/${tokenId}` : `/tokens/${tokenId}/${id}`}
          aria-current={activeTab === id ? "page" : undefined}
          className={`tk-detail-tabs__link${activeTab === id ? " is-active" : ""}`}
        >
          <Icon aria-hidden className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
