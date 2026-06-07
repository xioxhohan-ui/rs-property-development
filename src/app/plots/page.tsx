import { PlotCard } from '@/components/ui/PlotCard';
import { Search, Filter } from 'lucide-react';
import styles from './Plots.module.css';

import { db } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

async function getAllPlots() {
  try {
    const snapshot = await db.collection('plots').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    console.error('Error fetching all plots:', error);
    return [];
  }
}

export default async function PlotsPage() {
  const allPlots = await getAllPlots();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Explore Properties in Bangladesh</h1>
          <p className={styles.subtitle}>Find your ideal plot with our advanced search filters.</p>
          
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <Search className={styles.searchIcon} />
              <input type="text" placeholder="Search by location, district, or area..." />
            </div>
            
            <div className={styles.filters}>
              <select className={styles.select}>
                <option value="">Property Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="agricultural">Agricultural</option>
              </select>
              
              <select className={styles.select}>
                <option value="">District</option>
                <option value="dhaka">Dhaka</option>
                <option value="chattogram">Chattogram</option>
                <option value="sylhet">Sylhet</option>
                <option value="gazipur">Gazipur</option>
              </select>
              
              <select className={styles.select}>
                <option value="">Price Range</option>
                <option value="low">Below 50 Lakh</option>
                <option value="medium">50 Lakh - 2 Crore</option>
                <option value="high">Above 2 Crore</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-12">
        <div className={styles.resultsHeader}>
          <h2>Showing {allPlots.length} Properties</h2>
          <button className={styles.filterBtnMobile}>
            <Filter size={18} /> Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPlots.map(plot => (
            <PlotCard key={plot.id} {...plot} />
          ))}
        </div>
      </div>
    </div>
  );
}
