import Header from "@/app/dashboard/_components/Header";
import HeroSection from "@/components/HeroSection";
import WhyAISection from "@/components/WhyAISection";
import CtaSection from "@/components/CtaSection";
import FeaturesSection from "@/components/FeaturesSection";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fbf9f9] group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <Header />
      <HeroSection />
      <WhyAISection />
      <CtaSection />
      <FeaturesSection />
    </div>
  );
}