import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Maximize2, ShieldCheck, Share2, Phone, MessageCircle, ArrowLeft, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './PlotDetail.module.css';

import { db } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getPlotData(slug: string) {
  try {
    const snapshot = await db.collection('plots').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
  } catch (error) {
    console.error('Error fetching plot data:', error);
    return null;
  }
}

export default async function PlotDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) notFound();

  const plot = await getPlotData(slug);
  
  if (!plot) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/plots" className={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Plots
        </Link>
        
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.badges}>
              <span className={styles.badgeType}>{plot.type}</span>
              {plot.verified && (
                <span className={styles.badgeVerified}>
                  <ShieldCheck size={16} /> Verified Property
                </span>
              )}
            </div>
            <h1 className={styles.title}>{plot.title}</h1>
            <div className={styles.location}>
              <MapPin size={18} />
              <span>{plot.location}</span>
            </div>
          </div>
          
          <div className={styles.priceSection}>
            <div className={styles.price}>{plot.price}</div>
            <div className={styles.actions}>
              <button className={styles.iconBtn} aria-label="Share">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <Image src={plot.image || plot.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} alt={plot.title || 'Property'} fill className={styles.img} />
          </div>
          <div className={styles.sideImages}>
            <div className={styles.sideImage}>
              <Image src={plot.images?.[1] || plot.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} alt={plot.title || 'Property'} fill className={styles.img} />
            </div>
            <div className={styles.sideImage}>
              <Image src={plot.images?.[2] || plot.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'} alt={plot.title || 'Property'} fill className={styles.img} />
            </div>
          </div>
        </div>
        
        <div className={styles.contentGrid}>
          {/* Main Details */}
          <div className={styles.mainContent}>
            <div className={styles.overview}>
              <h2>Overview</h2>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewItem}>
                  <Maximize2 size={24} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewLabel}>Land Size</div>
                    <div className={styles.overviewValue}>{plot.size}</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <Home size={24} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewLabel}>Property Type</div>
                    <div className={styles.overviewValue}>{plot.type}</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <FileText size={24} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewLabel}>Ownership</div>
                    <div className={styles.overviewValue}>{plot.ownership}</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <MapPin size={24} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewLabel}>Road Access</div>
                    <div className={styles.overviewValue}>{plot.roadAccess}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.description}>
              <h2>Description</h2>
              <p>{plot.description}</p>
            </div>
            
            <div className={styles.facilities}>
              <h2>Nearby Facilities</h2>
              <ul className={styles.facilityList}>
                {plot.facilities && plot.facilities.map((facility: string, idx: number) => (
                  <li key={idx}>
                    <ShieldCheck size={18} className={styles.checkIcon} />
                    {facility}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.map}>
              <h2>Location Map</h2>
              <div className={styles.mapContainer}>
                {/* Placeholder for map */}
                <div className={styles.mapPlaceholder}>
                  Interactive Map Integration
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3>Interested in this property?</h3>
              <p>Contact our agent for more details or to schedule a viewing.</p>
              
              <div className={styles.contactButtons}>
                <Button variant="primary" fullWidth className={styles.contactBtn}>
                  <Phone size={18} /> Call Now
                </Button>
                <Button variant="outline" fullWidth className={styles.contactBtn}>
                  <MessageCircle size={18} /> WhatsApp
                </Button>
              </div>
              
              <div className={styles.divider}>or</div>
              
              <form className={styles.inquiryForm}>
                <input type="text" placeholder="Your Name" className={styles.input} />
                <input type="tel" placeholder="Phone Number" className={styles.input} />
                <input type="email" placeholder="Email Address" className={styles.input} />
                <textarea placeholder="Your Message" className={styles.textarea} rows={4}></textarea>
                <Button variant="secondary" fullWidth>Send Inquiry</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
