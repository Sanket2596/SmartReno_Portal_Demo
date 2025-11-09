"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  BID_STATUS_META,
  type BidStatus,
  type BidsTableRow,
} from "@/components/bids/types";

type BidEditModalProps = {
  bid: BidsTableRow | null;
  onCloseAction: () => void;
  onSaveAction: (bid: BidsTableRow) => void;
};

type FormState = {
  bidAmount: string;
  status: BidStatus;
  submittedOn: string;
  lastUpdate: string;
  notes: string;
};

const STATUS_OPTIONS: BidStatus[] = [
  "shortlisted",
  "declined",
  "under-review",
  "awarded",
  "submitted",
];

export function BidEditModal({ bid, onCloseAction, onSaveAction }: BidEditModalProps) {
  const open = Boolean(bid);
  const [formState, setFormState] = React.useState<FormState | null>(null);

  React.useEffect(() => {
    if (!bid) {
      setFormState(null);
      return;
    }

    setFormState({
      bidAmount: bid.bidAmount.toString(),
      status: bid.status,
      submittedOn: bid.submittedOn,
      lastUpdate: bid.lastUpdate ?? "",
      notes: bid.details.notes ?? "",
    });
  }, [bid]);

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

  const handleChange = React.useCallback(
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormState((current) =>
        current
          ? {
              ...current,
              [field]: event.target.value,
            }
          : current,
      );
    },
    [],
  );

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!bid || !formState) {
        return;
      }

      const updatedBid: BidsTableRow = {
        ...bid,
        bidAmount: Number(formState.bidAmount) || 0,
        status: formState.status,
        submittedOn: formState.submittedOn,
        lastUpdate: formState.lastUpdate ? formState.lastUpdate : null,
        details: {
          ...bid.details,
          notes: formState.notes.trim() ? formState.notes.trim() : undefined,
        },
      };

      onSaveAction(updatedBid);
    },
    [bid, formState, onSaveAction],
  );

  if (!bid || !formState) {
    return null;
  }

  const statusMeta = BID_STATUS_META[formState.status];

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
            className="relative flex w-full max-w-[680px] flex-col gap-6 rounded-[32px] border border-border/70 bg-background/95 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-foreground">
                  Edit Bid
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update bid information before syncing with the homeowner.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-border/60 text-muted-foreground"
                onClick={onCloseAction}
              >
                <span className="sr-only">Close edit modal</span>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="rounded-[24px] border border-border/60 bg-muted/10 p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                    Project
                    <Input
                      value={bid.project}
                      readOnly
                      className="h-11 cursor-not-allowed rounded-2xl border-border/40 bg-muted/20 text-sm font-medium text-muted-foreground"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                    Bid Amount (USD)
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      value={formState.bidAmount}
                      onChange={handleChange("bidAmount")}
                      className="h-11 rounded-2xl border-border/60 bg-background/80 text-sm font-medium"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                    Status
                    <div className="relative">
                      <select
                        value={formState.status}
                        onChange={handleChange("status")}
                        className={cn(
                          "flex h-11 w-full appearance-none items-center rounded-2xl border border-border/60 bg-background/80 px-4 text-sm font-semibold",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        )}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {BID_STATUS_META[option].label}
                          </option>
                        ))}
                      </select>
                      <span
                        className={cn(
                          "pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]",
                          statusMeta.pillClass,
                        )}
                      >
                        <span
                          className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dotClass)}
                        />
                      </span>
                    </div>
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                    Submitted On
                    <Input
                      type="date"
                      value={formState.submittedOn}
                      onChange={handleChange("submittedOn")}
                      className="h-11 rounded-2xl border-border/60 bg-background/80 text-sm font-medium"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                    Last Update
                    <Input
                      type="date"
                      value={formState.lastUpdate}
                      onChange={handleChange("lastUpdate")}
                      className="h-11 rounded-2xl border-border/60 bg-background/80 text-sm font-medium"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[24px] border border-border/60 bg-background/80 p-5">
                <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                  Notes
                  <textarea
                    value={formState.notes}
                    onChange={handleChange("notes")}
                    rows={4}
                    className="rounded-2xl border border-border/60 bg-background/80 p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    placeholder="Add context or next steps..."
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-full border-border/60 px-5 text-sm font-semibold"
                  onClick={onCloseAction}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 rounded-full px-6 text-sm font-semibold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

