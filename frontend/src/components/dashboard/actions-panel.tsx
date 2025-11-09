"use client";

import * as React from "react";
import {
  BellRing,
  MessageSquareText,
  FileSignature,
  Coins,
  ClipboardCheck,
  Home,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActionType = "urgent" | "review" | "lead" | "message" | "payment" | string;

type ActionItem = {
  id: string;
  type: ActionType;
  title: string;
  subtitle: string;
  actionLabel: string;
};

type ActionsPanelProps = {
  actions: ActionItem[];
};

const iconMap: Record<ActionType, { icon: LucideIcon; color: string }> = {
  urgent: { icon: BellRing, color: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300" },
  review: {
    icon: ClipboardCheck,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  },
  lead: { icon: Home, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" },
  message: {
    icon: MessageSquareText,
    color: "bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300",
  },
  payment: { icon: Coins, color: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300" },
  default: {
    icon: FileSignature,
    color: "bg-muted text-muted-foreground",
  },
};

export function ActionsPanel({ actions }: ActionsPanelProps) {
  return (
    <Card className="rounded-[28px] border border-border/70 bg-card/90 shadow-sm dark:border-border/50 dark:bg-card/80">
      <CardContent className="p-0">
        <div className="border-b border-border/60 px-6 py-4 text-lg font-semibold text-foreground">
          Today&apos;s Actions
        </div>

        <ul className="divide-y divide-border/70">
          {actions.map((action) => {
            const iconConfig = iconMap[action.type] ?? iconMap.default;
            const Icon = iconConfig.icon;

            return (
              <motion.li
                key={action.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group flex flex-col gap-4 px-6 py-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-muted/20 text-muted-foreground transition-all group-hover:scale-105",
                      iconConfig.color,
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-full rounded-full text-sm font-semibold sm:w-auto"
                >
                  {action.actionLabel}
                </Button>
              </motion.li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

