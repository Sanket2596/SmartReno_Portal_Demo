"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Mail, MapPin, Phone, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

import { BID_STATUS_META, type BidsTableRow } from "@/components/bids/types";

type BidDetailsModalProps = {
  bid: BidsTableRow | null;
  onCloseAction: () => void;
};

function formatDate(dateISO: string | null) {
  if (!dateISO) {
    return "—";
  }

  const date = new Date(dateISO);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function BidDetailsModal({ bid, onCloseAction }: BidDetailsModalProps) {
  const open = Boolean(bid);

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

  if (!bid) {
    return null;
  }

  const statusMeta = BID_STATUS_META[bid.status];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center bg-black/25 px-4 pb-10 pt-[120px] backdrop-blur-sm sm:px-6"
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
            className="relative flex w-full max-w-[720px] flex-col gap-6 rounded-[32px] border border-border/70 bg-background/95 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {bid.project}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                      statusMeta.pillClass,
                    )}
                  >
                    <span className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dotClass)} />
                    {statusMeta.label}
                  </span>
                  <span>
                    Bid Amount:{" "}
                    <span className="font-semibold text-foreground">
                      {formatNumber(bid.bidAmount, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground"
                onClick={onCloseAction}
              >
                <span className="sr-only">Close bid details</span>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 rounded-[24px] border border-border/60 bg-muted/10 p-4 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>
                  Submitted:{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(bid.submittedOn)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>
                  Last Update:{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(bid.lastUpdate)}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 text-primary" />
                <span>
                  Homeowner:{" "}
                  <span className="font-semibold text-foreground">
                    {bid.details.homeowner}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  Location:{" "}
                  <span className="font-semibold text-foreground">
                    {bid.details.location}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="truncate">
                  Contact:{" "}
                  <a
                    href={`mailto:${bid.details.contactEmail}`}
                    className="font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    {bid.details.contactEmail}
                  </a>
                </span>
              </div>
              {bid.details.contactPhone ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>
                    Phone:{" "}
                    <a
                      href={`tel:${bid.details.contactPhone}`}
                      className="font-semibold text-foreground underline-offset-4 hover:underline"
                    >
                      {bid.details.contactPhone}
                    </a>
                  </span>
                </div>
              ) : null}
            </div>

            <div className="rounded-[24px] border border-border/60 bg-background/80 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Scope of Work
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {bid.details.scope.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {bid.details.notes ? (
              <div className="rounded-[24px] border border-primary/30 bg-primary/5 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
                  Notes
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-primary/90">
                  {bid.details.notes}
                </p>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full border-border/60 px-5 text-sm font-semibold"
                onClick={onCloseAction}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

