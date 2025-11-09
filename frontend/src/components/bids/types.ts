"use client";

export type BidStatus =
  | "shortlisted"
  | "declined"
  | "under-review"
  | "awarded"
  | "submitted";

export type BidAction = "edit" | "view";

export type BidDetails = {
  homeowner: string;
  location: string;
  scope: string[];
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
};

export type BidsTableColumn = {
  id: string;
  label: string;
};

export type BidsTableRow = {
  id: string;
  project: string;
  bidAmount: number;
  status: BidStatus;
  submittedOn: string;
  lastUpdate: string | null;
  actions: BidAction[];
  details: BidDetails;
};

export type BidsTableData = {
  title: string;
  subtitle?: string;
  columns: BidsTableColumn[];
  bids: BidsTableRow[];
};

export const BID_STATUS_META: Record<
  BidStatus,
  {
    label: string;
    dotClass: string;
    pillClass: string;
  }
> = {
  shortlisted: {
    label: "Shortlisted",
    dotClass: "bg-emerald-500",
    pillClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  declined: {
    label: "Declined",
    dotClass: "bg-rose-500",
    pillClass: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  },
  "under-review": {
    label: "Under Review",
    dotClass: "bg-amber-500",
    pillClass: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  },
  awarded: {
    label: "Awarded",
    dotClass: "bg-sky-500",
    pillClass: "bg-sky-500/10 text-sky-200 border-sky-500/20",
  },
  submitted: {
    label: "Submitted",
    dotClass: "bg-blue-400",
    pillClass: "bg-blue-500/10 text-blue-200 border-blue-500/20",
  },
};

