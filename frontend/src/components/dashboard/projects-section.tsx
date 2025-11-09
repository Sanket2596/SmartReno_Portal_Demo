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
  synced: "Synced",
  failed: "Failed",
  pending: "Pending",
} as const;

const STATUS_STYLES: Record<
  keyof typeof STATUS_LABELS,
  { badge: string; dot: string }
> = {
  synced: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: {
    badge: "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200",
    dot: "bg-rose-500",
  },
  pending: {
    badge: "bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
    dot: "bg-amber-500",
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
  homeowner: string;
  projectType: string;
  status: ProjectStatus;
  budget: number;
  createdAt: string;
  lastSyncedAt: string;
  location: string;
};

export type ProjectsSectionData = {
  title: string;
  subtitle?: string;
  tabs: ProjectsTab[];
  activeTab?: string;
  summaries: ProjectsSummary[];
  filters: ProjectsFilters;
  projects: ProjectCardItem[];
};

type ProjectsSectionProps = {
  data: ProjectsSectionData;
};

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = React.useState(
    data.activeTab ?? data.tabs[0]?.id ?? "",
  );
  const [statusFilter, setStatusFilter] = React.useState(
    data.filters.defaultStatus ?? data.filters.statusOptions[0] ?? "All Status",
  );
  const [searchTerm, setSearchTerm] = React.useState("");

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
        `${project.homeowner} ${project.projectType}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [data.projects, normalizedStatus, searchTerm]);

  return (
    <section className="rounded-[32px] border border-border/60 bg-background/80 p-7 shadow-lg shadow-primary/5 backdrop-blur-sm dark:border-border/40 dark:bg-background/70">
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
                <span>{formatNumber(summary.value, { maximumFractionDigits: 0 })}</span>
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
      </div>

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
                    {project.homeowner}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.projectType}
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
                  {formatNumber(project.budget, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span>
                    Created:{" "}
                    <span className="font-medium text-foreground">
                      {project.createdAt}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>
                    Last Synced:{" "}
                    <span className="font-medium text-foreground">
                      {project.lastSyncedAt}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{project.location}</span>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 rounded-full border-border/60 text-sm font-semibold"
                >
                  View Details
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 rounded-full text-sm font-semibold"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Sync with CMS
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

