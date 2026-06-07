import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { PlotCard } from '@/components/ui/PlotCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

import { db } from '@/lib/firebase/admin';

async function getFeaturedPlots() {
  try {
    const snapshot = await db.collection('properties').limit(3).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.createdAt;
      delete data.updatedAt;
      return {
        id: doc.id,
        ...data
      };
    }) as any[];
  } catch (error) {
    console.error('Error fetching featured plots:', error);
    return [];
  }
}

export default async function Home() {
  const featuredPlots = await getFeaturedPlots();

  return (
    <>
      <Hero />
      <Stats />
      <Features />
      
      {/* Featured Properties Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted">Explore handpicked premium locations</p>
            </div>
            <div className="hidden md:block">
              <Link href="/plots">
                <Button variant="outline">View All Plots</Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlots.map((plot) => (
              <PlotCard key={plot.id} {...plot} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/plots">
              <Button variant="outline" fullWidth>View All Plots</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
