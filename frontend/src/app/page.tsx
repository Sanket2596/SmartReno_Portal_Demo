import dashboardData from "@/data/dashboard.json";
import { TopHeader } from "@/components/dashboard/top-header";
import { SummarySection } from "@/components/dashboard/summary-section";
import { ActionsPanel } from "@/components/dashboard/actions-panel";
import { SidebarPanels } from "@/components/dashboard/sidebar-panels";
import { ProjectsSection } from "@/components/dashboard/projects-section";
import type { SummaryData } from "@/components/dashboard/summary-section";

export default function Home() {
  const { summary: summaryData, timeframes, actions, schedule, messages, projects } = dashboardData;
  const summary = summaryData as SummaryData;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <TopHeader />
      <main className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <SummarySection summary={summary} timeframes={timeframes} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <ActionsPanel actions={actions} />
            <ProjectsSection projects={projects} />
          </div>
          <SidebarPanels schedule={schedule} messages={messages} />
        </div>
      </main>
    </div>
  );
}
