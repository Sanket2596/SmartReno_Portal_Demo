"use client";

import * as React from "react";
import {
  CalendarDays,
  DollarSign,
  MapPin,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatNumber } from "@/lib/utils";

const STATUS_LABELS = {
  "due-soon": "Due Soon",
  "open-bids": "Open for Bids",
  closed: "Closed",
} as const;

const STATUS_STYLES: Record<
  keyof typeof STATUS_LABELS,
  { badge: string; dot: string }
> = {
  "due-soon": {
    badge: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  "open-bids": {
    badge: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  closed: {
    badge: "bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200",
    dot: "bg-slate-500",
  },
};

type ProjectStatus = keyof typeof STATUS_LABELS;

type ProjectsSummary = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
};

type ProjectsTab = {
  id: string;
  label: string;
};

type ProjectsFilters = {
  searchPlaceholder: string;
  statusOptions: string[];
  defaultStatus?: string;
};

type ProjectCardItem = {
  id: string;
  title: string;
  category: string;
  status: ProjectStatus;
  estimate: number;
  estimateLabel?: string;
  location: string;
  timeline: string;
  highlights: string[];
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
};

const BEST_MATCH_STATUS: Record<
  "open" | "closing" | "closed",
  { label: string; className: string }
> = {
  open: {
    label: "Open for Bids",
    className:
      "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
  },
  closing: {
    label: "Open for Bids",
    className:
      "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
  },
  closed: {
    label: "Bidding Closed",
    className:
      "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
  },
};

type BestMatchStatus = keyof typeof BEST_MATCH_STATUS;

type BestMatchProject = {
  id: string;
  title: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  postedAgo: string;
  description: string;
  categories: string[];
  bidsSummary: string;
  status: BestMatchStatus;
};

export type ProjectsSectionData = {
  title: string;
  subtitle?: string;
  tabs: ProjectsTab[];
  activeTab?: string;
  summaries: ProjectsSummary[];
  filters: ProjectsFilters;
  projects: ProjectCardItem[];
  bestMatches?: BestMatchProject[];
};

type ProjectsSectionProps = {
  data: ProjectsSectionData;
  showControls?: boolean;
};

export function ProjectsSection({ data, showControls = true }: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = React.useState(
    data.activeTab ?? data.tabs[0]?.id ?? "",
  );
  const [statusFilter, setStatusFilter] = React.useState(
    data.filters.defaultStatus ?? data.filters.statusOptions[0] ?? "All Status",
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  const isBestMatchesActive =
    activeTab === "best-matches" && (data.bestMatches?.length ?? 0) > 0;

  const normalizedStatus = React.useMemo(
    () => statusFilter.toLowerCase(),
    [statusFilter],
  );

  const filteredProjects = React.useMemo(() => {
    return data.projects.filter((project) => {
      const matchesStatus =
        normalizedStatus === "all status" ||
        STATUS_LABELS[project.status].toLowerCase() === normalizedStatus;
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        `${project.title} ${project.category} ${project.location}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [data.projects, normalizedStatus, searchTerm]);

  return (
    <section className="rounded-[32px] border border-border/60 bg-background/80 p-7 shadow-lg shadow-primary/5 backdrop-blur-sm dark:border-border/40 dark:bg-background/70">
      {showControls ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold text-foreground">
                {data.title}
              </h2>
              {data.subtitle ? (
                <p className="text-sm text-muted-foreground">{data.subtitle}</p>
              ) : null}
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="shrink-0">
              <TabsList className="flex w-full items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 text-xs font-semibold uppercase tracking-[0.08em]">
                {data.tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {!isBestMatchesActive ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {data.summaries.map((summary) => (
                  <div
                    key={summary.id}
                    className="rounded-3xl border border-border/50 bg-muted/30 px-5 py-4 shadow-sm backdrop-blur-sm transition hover:border-primary/50 hover:shadow-md dark:bg-muted/20"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {summary.label}
                    </p>
                    <div className="mt-2 flex items-end gap-1 text-2xl font-semibold text-foreground">
                      <span>
                        {formatNumber(summary.value, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      {summary.suffix ? (
                        <span className="pb-[2px] text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {summary.suffix}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-y border-border/40 py-5 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={data.filters.searchPlaceholder}
                    className="h-12 rounded-full border border-border/60 bg-background/80 pl-11 pr-4 text-sm shadow-none focus-visible:border-primary focus-visible:ring-primary/30"
                    aria-label="Search projects"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full border border-border/60 bg-background/80 px-5 text-sm font-semibold text-foreground hover:border-primary/50"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      {statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl border-border/50">
                    {data.filters.statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onSelect={() => setStatusFilter(option)}
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm font-medium",
                          option === statusFilter ? "bg-muted text-foreground" : "",
                        )}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {isBestMatchesActive ? (
        <div className="mt-6 space-y-6">
          {data.bestMatches?.map((project) => {
            const statusMeta =
              BEST_MATCH_STATUS[project.status] ?? BEST_MATCH_STATUS.open;

            return (
              <article
                key={project.id}
                className="rounded-[28px] border border-border/60 bg-background/85 p-6 shadow-sm transition hover:border-primary/50 hover:shadow-lg dark:border-border/40 dark:bg-background/75 sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <h3 className="text-xl font-semibold text-foreground">
                        {project.title}
                      </h3>
                      <Badge
                        className={cn(
                          "w-fit rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]",
                          statusMeta.className,
                        )}
                      >
                        {statusMeta.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {formatNumber(project.budgetMin, {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                          {" – "}
                          {formatNumber(project.budgetMax, {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        Posted {project.postedAgo}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {project.location}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full border-border/60 px-6 text-sm font-semibold"
                  >
                    View Details
                  </Button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {project.categories.map((category) => (
                    <div
                      key={category}
                      className="rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {category}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Bids: {project.bidsSummary}</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const statusLabel = STATUS_LABELS[project.status];
            const statusStyle = STATUS_STYLES[project.status];

            return (
              <article
                key={project.id}
                className="flex h-full flex-col gap-5 rounded-[28px] border border-border/60 bg-background/85 p-6 shadow-sm transition hover:border-primary/50 hover:shadow-lg dark:border-border/40 dark:bg-background/75"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.category}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                      statusStyle.badge,
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", statusStyle.dot)} />
                    {statusLabel}
                  </Badge>
                </div>

                <div className="flex items-baseline gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-semibold text-foreground">
                    {formatNumber(project.estimate, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                    {project.estimateLabel ? (
                      <span className="ml-2 text-sm font-medium text-muted-foreground">
                        {project.estimateLabel}
                      </span>
                    ) : null}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <span>{project.timeline}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="mt-1 h-4 w-4 text-primary" />
                    <span className="text-sm leading-relaxed">
                      {project.description}
                    </span>
                  </div>
                  {project.highlights.length > 0 ? (
                    <div className="flex items-start gap-2">
                      <RefreshCcw className="mt-1 h-4 w-4 text-primary" />
                      <span className="text-sm leading-relaxed">
                        {project.highlights.join(", ")}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 rounded-full border-border/60 text-sm font-semibold"
                  >
                    {project.primaryActionLabel ?? "View Details"}
                  </Button>
                  {project.secondaryActionLabel ? (
                    <Button
                      type="button"
                      className="h-11 flex-1 rounded-full text-sm font-semibold"
                    >
                      {project.secondaryActionLabel}
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

