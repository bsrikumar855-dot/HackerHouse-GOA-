import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import HeroSection from "@/components/HeroSection";
import StatsStrip from "@/components/StatsStrip";
import AgendaSection from "@/components/AgendaSection";
import TaskSection from "@/components/TaskSection";
import RoadmapSection from "@/components/RoadmapSection";
import FaqSection from "@/components/FaqSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="flex min-h-dvh flex-col bg-hh-green text-hh-cream">
        <HeroSection />
        <StatsStrip />
        <AgendaSection />
        <TaskSection />
        <RoadmapSection />
        <FaqSection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}

