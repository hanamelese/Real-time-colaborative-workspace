

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <InteractivePreview />
        <FeaturesSection />
        <TechStackSection />

      </main>
    </div>
  );
}