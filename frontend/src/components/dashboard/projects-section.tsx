"use client";

import * as React from "react";
import { MapPin, BadgeInfo, Clock3, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

type ProjectItem = {
  id: string;
  title: string;
  status: string;
  region: string;
  budget: number;
  due: string;
  description: string;
};

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

const statusStyles: Record<string, { badge: string; className: string }> = {
  "Due Soon": {
    badge: "Due Soon",
    className: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200",
  },
  "Open For Bids": {
    badge: "Open For Bids",
    className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
  },
  Completed: {
    badge: "Completed",
    className: "bg-slate-200 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200",
  },
  Closed: {
    badge: "Closed",
    className: "bg-slate-200 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200",
  },
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm dark:border-border/50 dark:bg-card/80">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Projects / Leads</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden h-9 w-9 rounded-full lg:flex">
            <BadgeInfo className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {projects.map((project, idx) => {
            const status = statusStyles[project.status] ?? statusStyles.Completed;
            return (
              <motion.div
                key={project.id}
                className="snap-start"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Card className="h-full min-w-[260px] rounded-[24px] border border-border/60 bg-muted/20 shadow-sm transition hover:border-primary/50 hover:shadow-lg dark:bg-muted/10">
                  <CardContent className="flex h-full flex-col gap-4 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{project.title}</h4>
                        <Badge
                          className={cn(
                            "mt-2 rounded-full px-3 py-1 text-[11px] font-semibold",
                            status.className,
                          )}
                          variant="secondary"
                        >
                          {status.badge}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {project.region}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BadgeInfo className="h-4 w-4 text-primary" />
                        ${formatNumber(project.budget)} est.
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock3 className="h-4 w-4 text-primary" />
                        {project.due}
                      </div>
                    </div>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-primary">
                      View Details <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          <div className="pointer-events-none self-stretch rounded-[24px] border border-dashed border-border/60 bg-muted/10 px-6 py-10 text-sm font-semibold text-muted-foreground">
            More projects coming soon
          </div>
        </div>
      </div>
    </section>
  );
}

