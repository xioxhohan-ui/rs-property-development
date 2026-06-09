import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { PlotCard } from '@/components/ui/PlotCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

import { HomepageRealtimeFeed } from '@/components/sections/HomepageRealtimeFeed';

export default async function Home() {

  return (
    <>
      <Hero />
      <Stats />
      <Features />
      
      <HomepageRealtimeFeed />
    </>
  );
}
