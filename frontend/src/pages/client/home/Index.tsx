import FinalCtaSection from "./FinalCtaSection";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import ImpactSection from "./ImpactSection";
import NavigationBannerSection from "./NavigationBannerSection";
import NavigationFeatureSection from "./NavigationFeatureSection";
import TestimonialsSection from "./TestimonialsSection";

export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#f3f9ff]">
            <HeroSection />
            <HowItWorksSection />
            <NavigationFeatureSection />
            <NavigationBannerSection />
            <ImpactSection />
            <TestimonialsSection />
            <FinalCtaSection />
        </main>
    );
}