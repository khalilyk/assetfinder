import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LiveRecords } from "@/components/landing/LiveRecords";
import { BuiltFor } from "@/components/landing/BuiltFor";
import { ToolsGrid } from "@/components/landing/ToolsGrid";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <div className="bg-brand-dark">
        <Header />
        <Hero />
        <StatsBar />
      </div>
      <TrustedBy />
      <HowItWorks />
      <LiveRecords />
      <BuiltFor />
      <ToolsGrid />
      <CtaBanner />
      <Footer />
    </main>
  );
}
