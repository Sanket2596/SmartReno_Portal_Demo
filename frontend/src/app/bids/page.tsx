import bidsData from "@/data/bids.json";
import { TopHeader } from "@/components/dashboard/top-header";
import { BidsTable } from "@/components/bids/bids-table";
import type { BidsTableData } from "@/components/bids/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BidsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const tableData = bidsData as BidsTableData;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-muted/50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <TopHeader />
      <main className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <BidsTable data={tableData} />
      </main>
    </div>
  );
}

