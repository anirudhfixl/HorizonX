import React, { useState, useMemo } from 'react';
import { usePartners, useProjects, useTokens, type PartnerItem, type Project, type Token } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import {
  Handshake,
  Search,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Coins,
  Sparkles,
  ArrowUpRight,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type PartnerSortOption = 'name-asc' | 'name-desc' | 'tier-asc';

export function PartnerDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState<PartnerSortOption>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const { data: partners = [], isLoading } = usePartners();
  const { data: projects = [] } = useProjects();
  const { data: tokens = [] } = useTokens();

  // Maps for fast entity resolution
  const projectMap = useMemo(() => {
    const map = new Map<string, Project>();
    projects.forEach((p) => map.set(p.id, p));
    return map;
  }, [projects]);

  const tokenMap = useMemo(() => {
    const map = new Map<string, Token>();
    tokens.forEach((t) => map.set(t.id, t));
    return map;
  }, [tokens]);

  // Derived filter facets
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [partners]);

  const uniqueTiers = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((p) => {
      if (p.tier) set.add(p.tier);
    });
    return Array.from(set).sort();
  }, [partners]);

  // Filtering & Sorting
  const filteredPartners = useMemo(() => {
    let result = [...partners];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tier && p.tier.toLowerCase().includes(q)) ||
          (p.verifiedIntegrations && p.verifiedIntegrations.some((v) => v.toLowerCase().includes(q)))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (tierFilter !== 'all') {
      result = result.filter((p) => p.tier?.toLowerCase() === tierFilter.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'tier-asc') return (a.tier || '').localeCompare(b.tier || '');
      return 0;
    });

    return result;
  }, [partners, searchQuery, categoryFilter, tierFilter, sortBy]);

  // Pagination
  const totalItems = filteredPartners.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPartners = filteredPartners.slice(startIndex, startIndex + pageSize);

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all' || tierFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTierFilter('all');
    setCurrentPage(1);
  };

  return (
    <section className="space-y-6 pt-4" aria-labelledby="partner-directory-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="partner-directory-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Partner Directory &amp; Ecosystem Alliances
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore verified infrastructure providers, DeFi guilds, security auditors, and analytical partners backing HorizonX.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-xs text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'partner' : 'partners'} recorded
          </span>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by partner name, category, tier, or verified integration..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-xl border-border/60 bg-secondary/30 pl-9 pr-9 text-xs"
              aria-label="Search partners"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear partner search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-xl border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:outline-none focus:border-primary"
              aria-label="Filter by category"
            >
              <option value="all" className="bg-card text-foreground">
                All Categories
              </option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c} className="bg-card text-foreground">
                  {c}
                </option>
              ))}
            </select>

            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-xl border border-border/60 bg-secondary/30 px-3 text-xs text-foreground focus:outline-none focus:border-primary"
              aria-label="Filter by partnership tier"
            >
              <option value="all" className="bg-card text-foreground">
                All Tiers
              </option>
              {uniqueTiers.map((t) => (
                <option key={t} value={t} className="bg-card text-foreground">
                  {t}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex items-center rounded-xl border border-border/60 bg-secondary/30 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded-lg p-2 text-xs transition-colors',
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={cn(
                  'rounded-lg p-2 text-xs transition-colors',
                  viewMode === 'table' ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40 text-xs">
            <span className="text-[11px] text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Search: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Remove search filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Category: {categoryFilter}
                <button type="button" onClick={() => setCategoryFilter('all')} aria-label="Remove category filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {tierFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Tier: {tierFilter}
                <button type="button" onClick={() => setTierFilter('all')} aria-label="Remove tier filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-muted-foreground hover:text-primary transition-colors underline"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Directory Content */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted-foreground animate-pulse">Loading partners directory...</div>
      ) : paginatedPartners.length === 0 ? (
        <EmptyState
          title="No partners found"
          description="Try adjusting your keyword search or category filters to discover HorizonX partners."
          action={
            hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear active filters
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedPartners.map((partner) => {
            const linkedProjects = (partner.projectIds || []).map((id) => projectMap.get(id)).filter(Boolean) as Project[];
            const linkedTokens = (partner.tokenIds || []).map((id) => tokenMap.get(id)).filter(Boolean) as Token[];

            return (
              <article
                key={partner.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="space-y-4">
                  {/* Header: Identity, Category, Tier */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-bold text-sm text-primary shadow-inner">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {partner.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                            {partner.category}
                          </span>
                          {partner.tier && (
                            <span className="rounded-full bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                              {partner.tier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {partner.description}
                  </p>

                  {/* Verified Integrations */}
                  {partner.verifiedIntegrations && partner.verifiedIntegrations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                        Verified Integrations
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {partner.verifiedIntegrations.map((vi) => (
                          <span
                            key={vi}
                            className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-secondary/20 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                            {vi}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cross-Ecosystem Relationships */}
                  {(linkedProjects.length > 0 || linkedTokens.length > 0) && (
                    <div className="space-y-2 rounded-xl border border-border/40 bg-secondary/20 p-3 text-xs">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">
                        Ecosystem Affiliations
                      </span>
                      {linkedProjects.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Building2 className="h-3 w-3 text-primary shrink-0" />
                          <span className="text-[11px] text-muted-foreground">Projects:</span>
                          {linkedProjects.map((proj) => (
                            <Link
                              key={proj.id}
                              to={`/projects/${proj.id}`}
                              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors text-[11px]"
                            >
                              {proj.name}
                              <ArrowUpRight className="h-2.5 w-2.5 text-primary" />
                            </Link>
                          ))}
                        </div>
                      )}
                      {linkedTokens.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Coins className="h-3 w-3 text-primary shrink-0" />
                          <span className="text-[11px] text-muted-foreground">Tokens:</span>
                          {linkedTokens.map((tok) => (
                            <Link
                              key={tok.id}
                              to={`/tokens/${tok.id}`}
                              className="font-mono font-semibold text-primary hover:underline text-[11px]"
                            >
                              ${tok.symbol}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer: Performance Metrics & Official Link */}
                <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs">
                  <div>
                    {partner.referredVolume && (
                      <span className="block font-mono font-bold text-foreground">
                        {partner.referredVolume}
                      </span>
                    )}
                    <span className="block text-[10px] text-muted-foreground">Referred volume</span>
                  </div>

                  {partner.website && (
                    <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 border-border/60 text-xs hover:border-primary">
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        <span>Official Link</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-secondary/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Integrations</th>
                <th className="px-4 py-3">Linked Entities</th>
                <th className="px-4 py-3 text-right">Volume</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedPartners.map((partner) => {
                const linkedProjects = (partner.projectIds || []).map((id) => projectMap.get(id)).filter(Boolean) as Project[];
                const linkedTokens = (partner.tokenIds || []).map((id) => tokenMap.get(id)).filter(Boolean) as Token[];

                return (
                  <tr key={partner.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-foreground">{partner.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{partner.description}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-primary">{partner.category}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-muted-foreground">{partner.tier || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-muted-foreground">
                        {partner.verifiedIntegrations?.join(', ') || 'Protocol Alliance'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        {linkedProjects.map((p) => (
                          <Link key={p.id} to={`/projects/${p.id}`} className="block text-foreground hover:text-primary transition-colors">
                            {p.name}
                          </Link>
                        ))}
                        {linkedTokens.map((t) => (
                          <Link key={t.id} to={`/tokens/${t.id}`} className="inline-block font-mono text-primary hover:underline mr-1.5">
                            ${t.symbol}
                          </Link>
                        ))}
                        {linkedProjects.length === 0 && linkedTokens.length === 0 && (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-foreground">
                      {partner.referredVolume || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {partner.website && (
                        <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs text-primary">
                          <a href={partner.website} target="_blank" rel="noopener noreferrer">
                            Visit <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{startIndex + 1}</strong> to{' '}
            <strong className="text-foreground">{Math.min(startIndex + pageSize, totalItems)}</strong> of{' '}
            <strong className="text-foreground">{totalItems}</strong> partners
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-8 gap-1 border-border/60 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <span className="font-mono text-xs px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 gap-1 border-border/60 text-xs"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

