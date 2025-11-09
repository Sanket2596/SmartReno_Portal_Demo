import dashboardData from "@/data/dashboard.json";
import { TopHeader } from "@/components/dashboard/top-header";
import { ProjectsSection } from "@/components/dashboard/projects-section";
import type { ProjectsSectionData } from "@/components/dashboard/projects-section";

export default function ProjectsPage() {
  const projectsData = dashboardData.projectsSection as ProjectsSectionData;

  return (
    <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-muted/50">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-primary/15 via-primary/5 to-transparent blur-2xl" />
      <TopHeader />
      <main className="mx-auto w-full max-w-[1400px] px-6 py-10">
        <div className="space-y-6">
          <ProjectsSection data={projectsData} />
        </div>
      </main>
    </div>
  );
}


