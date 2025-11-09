"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ScheduleItem } from "@/components/dashboard/sidebar-panels";

type CalendarModalProps = {
  open: boolean;
  onCloseAction: () => void;
  schedule: ScheduleItem[];
};

type CalendarDay = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleItem[];
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function createEventsMap(schedule: ScheduleItem[]) {
  const map = new Map<string, ScheduleItem[]>();

  schedule.forEach((event) => {
    const eventDate = new Date(event.datetime);
    const key = eventDate.toISOString().slice(0, 10);
    const events = map.get(key) ?? [];
    events.push(event);
    map.set(key, events);
  });

  return map;
}

function buildCalendarDays(activeDate: Date, eventsMap: Map<string, ScheduleItem[]>) {
  const firstOfMonth = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
  const startOfGrid = new Date(firstOfMonth);
  startOfGrid.setDate(startOfGrid.getDate() - startOfGrid.getDay());

  const today = new Date();
  const days: CalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startOfGrid);
    date.setDate(startOfGrid.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const events = eventsMap.get(key) ?? [];

    days.push({
      date,
      key,
      events,
      isCurrentMonth: date.getMonth() === activeDate.getMonth(),
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
    });
  }

  return days;
}

function sortSchedule(schedule: ScheduleItem[]) {
  return [...schedule].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
}

export function CalendarModal({ open, onCloseAction, schedule }: CalendarModalProps) {
  const sortedSchedule = React.useMemo(() => sortSchedule(schedule), [schedule]);
  const initialReferenceDate = React.useMemo(() => {
    const reference = sortedSchedule[0]?.datetime;
    return reference ? new Date(reference) : new Date();
  }, [sortedSchedule]);

  const [activeDate, setActiveDate] = React.useState(initialReferenceDate);

  React.useEffect(() => {
    if (open) {
      setActiveDate(initialReferenceDate);
    }
  }, [initialReferenceDate, open]);

  const eventsMap = React.useMemo(() => createEventsMap(sortedSchedule), [sortedSchedule]);

  const calendarDays = React.useMemo(
    () => buildCalendarDays(activeDate, eventsMap),
    [activeDate, eventsMap],
  );

  const goToPreviousMonth = React.useCallback(() => {
    setActiveDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = React.useCallback(() => {
    setActiveDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }, []);

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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCloseAction]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center bg-black/20 px-4 pb-10 pt-[120px] backdrop-blur-sm sm:px-6"
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
            className="relative flex w-full max-w-[960px] flex-col gap-6 rounded-[32px] border border-border/70 bg-background/95 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Calendar
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review your schedule and upcoming homeowner appointments.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground"
                  onClick={goToPreviousMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="rounded-full border border-border/60 px-4 py-2 text-sm font-semibold text-foreground">
                  {formatMonthLabel(activeDate)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground"
                  onClick={onCloseAction}
                  aria-label="Close calendar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 rounded-[28px] border border-border/60 bg-muted/20 p-5">
              <div className="grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {weekdayLabels.map((weekday) => (
                  <div key={weekday} className="text-center">
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => (
                  <div
                    key={day.key}
                    className={cn(
                      "flex min-h-[92px] flex-col rounded-2xl border border-transparent bg-background/70 p-2 text-sm shadow-sm transition hover:border-primary/40 hover:shadow-md",
                      !day.isCurrentMonth && "opacity-50",
                      day.isToday && "border-primary/60 bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                      <span>{day.date.getDate()}</span>
                      {day.events.length > 0 ? (
                        <span className="inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">
                          {day.events.length} {day.events.length === 1 ? "Event" : "Events"}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 space-y-1">
                      {day.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="rounded-xl border border-primary/20 bg-primary/10 px-2 py-1 text-[11px] font-semibold leading-snug text-primary"
                        >
                          {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 ? (
                        <div className="rounded-xl bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground">
                          +{day.events.length - 2} more
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-muted/10 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Upcoming Appointments
              </h3>
              <div className="mt-4 space-y-4">
                {sortedSchedule.map((event) => {
                  const date = new Date(event.datetime);
                  const dateLabel = date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                  const timeLabel = date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={event.id}
                      className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {dateLabel} · {timeLabel}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

