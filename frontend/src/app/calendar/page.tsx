import calendarData from "@/data/calendar.json";
import { TopHeader } from "@/components/dashboard/top-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CloudCheck,
  Download,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type CalendarEventType = "time-off" | "project" | "appointment" | "reminder";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  type: CalendarEventType;
  time?: string;
  address?: string;
  projectOwner?: string;
};

type CalendarData = {
  title: string;
  month: number;
  year: number;
  highlightDate?: string;
  syncedProviders?: string[];
  events: CalendarEvent[];
};

type CalendarDay = {
  date: Date;
  label: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHighlighted: boolean;
  events: CalendarEvent[];
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_STYLES: Record<
  CalendarEventType,
  { badge: string; pill: string }
> = {
  "time-off": {
    badge: "bg-rose-500/15 text-rose-500",
    pill: "bg-rose-500/15 text-rose-600",
  },
  project: {
    badge: "bg-emerald-500/15 text-emerald-600",
    pill: "bg-emerald-500/15 text-emerald-600",
  },
  appointment: {
    badge: "bg-sky-500/15 text-sky-600",
    pill: "bg-sky-500/15 text-sky-600",
  },
  reminder: {
    badge: "bg-amber-500/15 text-amber-600",
    pill: "bg-amber-500/20 text-amber-600",
  },
};

function buildCalendarDays(data: CalendarData): CalendarDay[] {
  const { month, year, events, highlightDate } = data;
  const eventsMap = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    eventsMap.set(event.date, [...(eventsMap.get(event.date) ?? []), event]);
  });

  const firstOfMonth = new Date(year, month - 1, 1);
  const startDate = new Date(firstOfMonth);
  const firstDayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  const today = new Date();
  const highlight = highlightDate ? new Date(highlightDate) : null;
  const days: CalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const isoKey = date.toISOString().slice(0, 10);
    const isCurrentMonth = date.getMonth() === month - 1;

    days.push({
      date,
      label: String(date.getDate()),
      isCurrentMonth,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
      isHighlighted:
        !!highlight &&
        date.getFullYear() === highlight.getFullYear() &&
        date.getMonth() === highlight.getMonth() &&
        date.getDate() === highlight.getDate(),
      events: eventsMap.get(isoKey) ?? [],
    });
  }

  return days;
}

function formatMonthLabel(month: number, year: number) {
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const calendar = calendarData as CalendarData;
  const days = buildCalendarDays(calendar);
  const monthLabel = formatMonthLabel(calendar.month, calendar.year);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-muted/50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <TopHeader />
      <main className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur-sm dark:border-border/40 dark:bg-card/80 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {calendar.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay on top of site visits, homeowner meetings, and critical
                project milestones.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border/60 px-5 text-sm font-semibold"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                type="button"
                className="rounded-full px-5 text-sm font-semibold"
              >
                + New Event
              </Button>
            </div>
          </header>

          <section className="rounded-[28px] border border-border/60 bg-background/85 p-6 shadow-sm backdrop-blur-sm dark:border-border/40 dark:bg-background/75">
            <div className="flex flex-col gap-4 border-b border-border/40 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-border/50"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="rounded-full border border-border/60 px-4 py-2 text-sm font-semibold text-foreground">
                  {monthLabel}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-border/50"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-border/60 px-4 text-xs font-semibold uppercase tracking-[0.12em]"
                >
                  Week
                </Button>
                <Button
                  type="button"
                  className="rounded-full px-4 text-xs font-semibold uppercase tracking-[0.12em]"
                >
                  Month
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-border/60 px-4 text-xs font-semibold uppercase tracking-[0.12em]"
                >
                  Agenda
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge className="flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">
                  <CloudCheck className="h-4 w-4 text-emerald-500" />
                  Synced
                </Badge>
                <span>
                  {calendar.syncedProviders?.join(", ") ?? "Manual schedule"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                Today is highlighted for quick reference.
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {DAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="rounded-2xl bg-muted/40 px-3 py-3 text-center"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <div
                    key={`${day.date.toISOString()}-${index}`}
                    className={cn(
                      "flex min-h-[110px] flex-col gap-2 rounded-[24px] border border-transparent bg-background/70 p-4 text-sm text-foreground shadow-sm transition hover:border-primary/40 hover:bg-background/90",
                      !day.isCurrentMonth && "opacity-50",
                      day.isHighlighted &&
                        "border-primary/40 bg-primary/10 shadow-[0_12px_30px_-18px_rgba(37,99,235,0.5)]",
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          day.isHighlighted && "text-primary",
                        )}
                      >
                        {day.label}
                      </span>
                      {day.isHighlighted ? (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                          Today
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-1">
                      {day.events.map((event) => {
                        const eventStyles = EVENT_STYLES[event.type];
                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "rounded-2xl px-3 py-2 text-xs font-semibold leading-tight",
                              eventStyles.pill,
                            )}
                          >
                            <p>{event.title}</p>
                            {event.time ? (
                              <p className="text-[10px] font-medium uppercase tracking-[0.16em] opacity-80">
                                {event.time}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <aside className="flex flex-col gap-4 rounded-[24px] border border-border/60 bg-background/80 p-4 text-sm text-foreground shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground">
                    Agenda
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tap an event to view its details, reschedule, or cancel.
                  </p>
                </div>

                <div className="space-y-3">
                  {calendar.events.map((event) => {
                    const eventStyles = EVENT_STYLES[event.type];
                    return (
                      <div
                        key={`agenda-${event.id}`}
                        className="rounded-[20px] border border-border/60 bg-background/70 p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            className={cn(
                              "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                              eventStyles.badge,
                            )}
                          >
                            {event.type === "time-off"
                              ? "Day Off"
                              : event.type === "project"
                                ? "Project"
                                : event.type === "appointment"
                                  ? "Appointment"
                                  : "Reminder"}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            {event.title}
                          </p>
                          {event.time ? (
                            <p className="text-xs text-muted-foreground">
                              {event.time}
                            </p>
                          ) : null}
                          {event.address ? (
                            <p className="text-xs text-muted-foreground">
                              {event.address}
                            </p>
                          ) : null}
                          {event.projectOwner ? (
                            <p className="text-xs text-muted-foreground">
                              Client:{" "}
                              <span className="font-medium text-foreground">
                                {event.projectOwner}
                              </span>
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                          <Button
                            type="button"
                            className="h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            Reschedule
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-full border-border/60 text-sm font-semibold"
                          >
                            Open in Google Calendar
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            className="h-10 rounded-full bg-rose-500/15 text-sm font-semibold text-rose-600 hover:bg-rose-500/25"
                          >
                            Cancel
                          </Button>
                        </div>
                        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Last synced: Today, 2:15 PM
                        </p>
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

