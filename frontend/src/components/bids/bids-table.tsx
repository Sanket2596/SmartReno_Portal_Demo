"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

import {
  BID_STATUS_META,
  type BidAction,
  type BidsTableData,
  type BidsTableRow,
} from "@/components/bids/types";
import { BidDetailsModal } from "@/components/bids/bid-details-modal";
import { BidEditModal } from "@/components/bids/bid-edit-modal";

function formatDateLabel(dateISO: string | null) {
  if (!dateISO) {
    return "—";
  }

  const date = new Date(dateISO);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function renderAction(
  action: BidAction,
  bid: BidsTableRow,
  handleView: (id: string) => void,
  handleEdit: (id: string) => void,
) {
  if (action === "edit") {
    return (
      <Button
        key={`${bid.id}-edit`}
        type="button"
        className="h-9 min-w-[72px] rounded-full px-4 text-sm font-semibold"
        onClick={() => handleEdit(bid.id)}
      >
        Edit
      </Button>
    );
  }

  return (
    <Button
      key={`${bid.id}-view`}
      type="button"
      variant="outline"
      className="h-9 min-w-[72px] rounded-full border-border/60 text-sm font-semibold"
      onClick={() => handleView(bid.id)}
    >
      View
    </Button>
  );
}

export function BidsTable({ data }: { data: BidsTableData }) {
  const [rows, setRows] = React.useState<BidsTableRow[]>(data.bids);
  const [selectedBid, setSelectedBid] = React.useState<BidsTableRow | null>(null);
  const [editingBid, setEditingBid] = React.useState<BidsTableRow | null>(null);

  React.useEffect(() => {
    setRows(data.bids);
  }, [data.bids]);

  const handleView = React.useCallback(
    (rowId: string) => {
      const row = rows.find((item) => item.id === rowId) ?? null;
      setSelectedBid(row);
    },
    [rows],
  );

  const handleEdit = React.useCallback(
    (rowId: string) => {
      const row = rows.find((item) => item.id === rowId) ?? null;
      setEditingBid(row);
    },
    [rows],
  );

  const handleSave = React.useCallback(
    (updatedBid: BidsTableRow) => {
      setRows((current) =>
        current.map((item) => (item.id === updatedBid.id ? updatedBid : item)),
      );
      setEditingBid(null);
      setSelectedBid((current) =>
        current && current.id === updatedBid.id ? updatedBid : current,
      );
    },
    [],
  );

  const closeViewModal = React.useCallback(() => setSelectedBid(null), []);
  const closeEditModal = React.useCallback(() => setEditingBid(null), []);

  return (
    <>
      <Card className="rounded-[28px] border border-border/70 bg-card/95 shadow-lg shadow-primary/5 backdrop-blur-sm dark:border-border/50 dark:bg-card/85">
      <CardContent className="flex flex-col gap-6 p-6 md:p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">{data.title}</h1>
          {data.subtitle ? (
            <p className="text-sm text-muted-foreground">{data.subtitle}</p>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-[24px] border border-border/60 bg-background/60">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border/70 text-sm">
              <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  {data.columns.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className={cn(
                        "px-5 py-4 text-left",
                        column.id === "actions" && "text-right",
                      )}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-sm text-foreground">
                {rows.map((bid) => {
                  const statusMeta = BID_STATUS_META[bid.status];

                  return (
                    <tr
                      key={bid.id}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="px-5 py-4 font-medium">{bid.project}</td>
                      <td className="px-5 py-4">
                        {formatNumber(bid.bidAmount, {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                            statusMeta.pillClass,
                          )}
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dotClass)} />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDateLabel(bid.submittedOn)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDateLabel(bid.lastUpdate)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {bid.actions.map((action) =>
                            renderAction(action, bid, handleView, handleEdit),
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      </Card>

      <BidDetailsModal bid={selectedBid} onCloseAction={closeViewModal} />
      <BidEditModal
        bid={editingBid}
        onCloseAction={closeEditModal}
        onSaveAction={handleSave}
      />
    </>
  );
}

