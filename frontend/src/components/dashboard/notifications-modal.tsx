'use client';

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Briefcase, CheckCircle2, Clock, MapPin, Trophy, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type NotificationCategory = "all" | "leads" | "bids" | "projects";

type NotificationItem = {
  id: string;
  category: Exclude<NotificationCategory, "all">;
  title: string;
  timeAgo: string;
  subtitle?: string;
  icon: React.ReactNode;
  accent: string;
};

const notificationTabs: Array<{ id: NotificationCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "leads", label: "Leads" },
  { id: "bids", label: "Bids" },
  { id: "projects", label: "Projects" },
];

const notifications: NotificationItem[] = [
  {
    id: "insurance-expiry",
    category: "bids",
    title: "Your insurance document expires in 5 days. Please renew to stay active.",
    timeAgo: "21 m",
    icon: <CheckCircle2 className="h-4 w-4 text-sky-500" />,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-200",
  },
  {
    id: "profile-progress-fresh",
    category: "leads",
    title: "Your account profile is 80% complete. Add service ZIP codes to get more leads.",
    timeAgo: "21 m",
    icon: <BellRing className="h-4 w-4 text-violet-500" />,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-200",
  },
  {
    id: "new-project-hoboken",
    category: "projects",
    title: "New project available: Bathroom Remodel – Hoboken",
    timeAgo: "1 hr",
    icon: <Briefcase className="h-4 w-4 text-emerald-500" />,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-200",
  },
  {
    id: "project-approved-brooklyn",
    category: "projects",
    title: "Project Kitchen Remodel – Brooklyn has been approved by the homeowner.",
    timeAgo: "10 h",
    icon: <CheckCircle2 className="h-4 w-4 text-sky-500" />,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-200",
  },
  {
    id: "rfp-basement-queens",
    category: "bids",
    title: "RFP Basement Finishing – Queens closes in 2 days.",
    timeAgo: "1 d",
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-200",
  },
  {
    id: "profile-progress-reminder",
    category: "leads",
    title: "Your account profile is 80% complete. Add service ZIP codes to get more leads.",
    timeAgo: "2 d",
    icon: <BellRing className="h-4 w-4 text-violet-500" />,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-200",
  },
  {
    id: "bid-under-review",
    category: "bids",
    title: "Your bid for Roof Repair – Jersey City is under review.",
    timeAgo: "2 d",
    icon: <Briefcase className="h-4 w-4 text-emerald-500" />,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-200",
  },
  {
    id: "congrats-awarded-queens",
    category: "projects",
    title: "Congratulations! You’ve been awarded Basement Finishing – Queens.",
    timeAgo: "4 d",
    icon: <Trophy className="h-4 w-4 text-amber-500" />,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-200",
  },
  {
    id: "site-visit-brooklyn",
    category: "projects",
    title: "You have a site visit scheduled at 10:00 AM – 45 King St, Brooklyn.",
    timeAgo: "5 d",
    icon: <MapPin className="h-4 w-4 text-sky-500" />,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-200",
  },
  {
    id: "payment-released",
    category: "projects",
    title: "“Payment of $4,500 has been released for Demolition Phase.”",
    timeAgo: "1 w",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-200",
  },
];

type NotificationsModalProps = {
  open: boolean;
  onCloseAction: () => void;
};

export function NotificationsModal({ open, onCloseAction }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = React.useState<NotificationCategory>("all");
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseAction();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCloseAction]);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => setActiveTab("all"), 250);
    }
  }, [open]);

  const filteredNotifications = React.useMemo(() => {
    if (activeTab === "all") {
      return notifications;
    }
    return notifications.filter((notification) => notification.category === activeTab);
  }, [activeTab]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex select-none justify-end bg-black/20 px-4 pb-10 pt-[110px] backdrop-blur-sm sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onCloseAction}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative flex h-[640px] w-full max-w-[420px] flex-col rounded-3xl border border-border/70 bg-background/95 shadow-2xl shadow-primary/5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-5">
              <div className="space-y-1.5">
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Stay on top of bids, leads, and project milestones.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground"
                onClick={onCloseAction}
              >
                <span className="sr-only">Close notifications</span>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 pb-4">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as NotificationCategory)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 gap-2 rounded-full bg-muted/40 p-1">
                  {notificationTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em]",
                        "transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                      )}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <Separator />

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <ul className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="group rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className={cn("h-10 w-10 border-none", notification.accent)}>
                        <AvatarFallback className={cn("h-full w-full border-none", notification.accent)}>
                          {notification.icon}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-relaxed text-foreground">
                          {notification.title}
                        </p>
                        {notification.subtitle ? (
                          <p className="text-xs text-muted-foreground">{notification.subtitle}</p>
                        ) : null}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{notification.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/70 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-full border border-border/60 bg-muted/20 py-5 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                See All
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
