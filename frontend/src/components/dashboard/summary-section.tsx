"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  BarChart3,
  BadgeCheck,
  Wallet2,
  FileSpreadsheet,
} from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import type { Transition } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "flat";

export type Metric = {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: {
    value: number;
    direction: TrendDirection;
  };
  goal?: number;
  total?: number;
};

type ActionRecommendation = {
  pendingActions: number;
  label: string;
  description: string;
  badge: string;
};

export type SummaryData = {
  greeting: {
    userName: string;
    periodLabel: string;
  };
  metrics: Metric[];
  actionRecommendation: ActionRecommendation;
};

type SummarySectionProps = {
  summary: SummaryData;
  timeframes: string[];
};

const metricIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "total-projects": BarChart3,
  payments: Wallet2,
  rfp: FileSpreadsheet,
  "successful-bids": BadgeCheck,
};

const trendStyles: Record<
  TrendDirection,
  { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; className: string; label: string }
> = {
  up: {
    icon: ArrowUpRight,
    className: "text-emerald-600 dark:text-emerald-400",
    label: "increase",
  },
  down: {
    icon: ArrowDownRight,
    className: "text-rose-500",
    label: "decrease",
  },
  flat: {
    icon: Minus,
    className: "text-muted-foreground",
    label: "no change",
  },
};

const timeframeTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
};

export function SummarySection({ summary, timeframes }: SummarySectionProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(
    timeframes?.[2] ?? timeframes?.[0] ?? "Monthly",
  );

  return (
    <section className="relative mt-8 w-full">
      <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-primary/8 via-background to-primary/2 blur-3xl" />
      <div className="rounded-[32px] border border-border/70 bg-card/95 p-8 shadow-lg shadow-primary/5 backdrop-blur-lg dark:border-border/40 dark:bg-card/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Displaying data from{" "}
              <span className="font-semibold text-primary">{summary.greeting.periodLabel}</span>
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Hello, <span className="text-primary">{summary.greeting.userName}!</span>
            </h2>
          </div>

          <LayoutGroup>
            <div className="relative inline-flex items-center rounded-full border border-primary/30 bg-primary/10 p-1 text-sm font-semibold shadow-inner shadow-primary/10">
              {timeframes.map((timeframe) => {
                const isActive = selectedTimeframe === timeframe;
                return (
                  <Button
                    key={timeframe}
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={cn(
                      "relative rounded-full px-5 py-2 text-xs uppercase tracking-wider text-primary/70 transition-colors hover:text-primary",
                      isActive && "text-primary",
                    )}
                  >
                    {timeframe}
                    {isActive ? (
                      <motion.span
                        layoutId="timeframe-pill"
                        transition={timeframeTransition}
                        className="absolute inset-0 -z-[1] rounded-full bg-background shadow-[0px_4px_16px_rgba(37,99,235,0.12)]"
                      />
                    ) : null}
                  </Button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {summary.metrics.map((metric) => {
            const Icon = metricIconMap[metric.id] ?? BarChart3;
            const direction =
              metric.trend.direction === "up" ||
              metric.trend.direction === "down" ||
              metric.trend.direction === "flat"
                ? metric.trend.direction
                : "flat";
            const trend = trendStyles[direction];
            const isCurrency = metric.unit.toLowerCase().includes("usd");
            const formattedValue = isCurrency
              ? `$${formatNumber(metric.value)}`
              : formatNumber(metric.value);
            const formattedGoal =
              metric.goal !== undefined
                ? isCurrency
                  ? `$${formatNumber(metric.goal)}`
                  : formatNumber(metric.goal)
                : undefined;
            const formattedTotal =
              metric.total !== undefined ? formatNumber(metric.total) : undefined;

            return (
              <Card
                key={metric.id}
                className="relative overflow-hidden rounded-[24px] border-border/60 bg-muted/30 transition hover:border-primary/40 hover:bg-muted/50 dark:bg-muted/20"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10" />
                <CardContent className="relative flex h-full flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <p className="text-xs text-muted-foreground/80">{metric.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tracking-tight text-foreground">
                        {formattedValue}
                      </span>
                      {formattedGoal && (
                        <span className="text-xs font-medium text-muted-foreground">
                          of {formattedGoal}
                        </span>
                      )}
                      {formattedTotal && (
                        <span className="text-xs font-medium text-muted-foreground">
                          accepted bids of {formattedTotal}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <trend.icon className={cn("h-4 w-4", trend.className)} />
                      <span className={trend.className}>
                      {direction === "flat"
                          ? "—"
                          : `${Math.abs(metric.trend.value)}%`}
                      </span>
                      <span className="text-muted-foreground">vs prev 28 Days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-primary/40 bg-gradient-to-br from-primary/15 via-primary/20 to-primary/40 p-5 text-primary-foreground shadow-lg shadow-primary/30">
            <div className="absolute right-6 top-6 h-16 w-16 rounded-full bg-white/20 blur-lg dark:bg-white/10" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-white/90">Actions</p>
              <p className="text-4xl font-semibold">
                {summary.actionRecommendation.pendingActions}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                className="w-full rounded-full bg-white/95 text-primary shadow-lg shadow-primary/40 transition hover:bg-white"
              >
                {summary.actionRecommendation.label}
              </Button>
              <div className="flex flex-col gap-1 text-left text-sm">
                <span className="text-white/80">
                  Recommended with <span className="font-semibold text-emerald-200">AI</span>
                </span>
                <Badge
                  variant="secondary"
                  className="w-fit rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-medium tracking-wider uppercase text-white shadow-sm backdrop-blur"
                >
                  {summary.actionRecommendation.badge}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

