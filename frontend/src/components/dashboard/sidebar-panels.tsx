"use client";

import * as React from "react";
import { CalendarDays, MapPin, MessageCircleMore, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarModal } from "@/components/dashboard/calendar-modal";

export type ScheduleItem = {
  id: string;
  title: string;
  datetime: string;
  location: string;
};

type MessageItem = {
  id: string;
  name: string;
  preview: string;
  relativeTime: string;
};

type SidebarPanelsProps = {
  schedule: ScheduleItem[];
  messages: MessageItem[];
};

function formatEventDate(dateISO: string) {
  const date = new Date(dateISO);
  return {
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    date: date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
}

export function SidebarPanels({ schedule, messages }: SidebarPanelsProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <Card className="rounded-[24px] border border-border/70 bg-card/90 shadow-sm dark:border-border/50 dark:bg-card/80">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <CalendarDays className="h-5 w-5 text-primary" />
              Upcoming Schedule
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full text-xs font-semibold"
              onClick={() => setCalendarOpen(true)}
            >
              View Calendar
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {schedule.map((event, idx) => {
              const { time, date } = formatEventDate(event.datetime);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.25 }}
                  className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 shadow-[0_4px_12px_-6px_rgba(15,23,42,0.15)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-foreground">{time}</span>
                      <span className="text-xs text-muted-foreground">{date}</span>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[24px] border border-border/70 bg-card/90 shadow-sm dark:border-border/50 dark:bg-card/80">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <MessageCircleMore className="h-5 w-5 text-primary" />
              Messages
            </div>
            <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs font-semibold">
              Go to Messages
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {messages.map((message, idx) => (
              <motion.button
                type="button"
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                className="group flex items-start justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-left transition hover:border-primary/60 hover:bg-muted/40"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{message.name}</p>
                  <p className="text-xs text-muted-foreground">{message.preview}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {message.relativeTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    Open Chat <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      <CalendarModal
        open={calendarOpen}
        onCloseAction={() => setCalendarOpen(false)}
        schedule={schedule}
      />
    </div>
  );
}

