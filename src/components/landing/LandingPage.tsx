"use client";

import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import { CommunityAidSection, ShelterSection } from "./MiddleSections";
import WorkflowSection from "./WorkflowSection";
import AnalyticsSection from "./AnalyticsSection";
import {
  WhySection,
  TestimonialsSection,
  CTASection,
  LandingFooter,
} from "./BottomSections";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07070c] text-white overflow-x-hidden">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CommunityAidSection />
        <WorkflowSection />
        <AnalyticsSection />
        <ShelterSection />
        <WhySection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
