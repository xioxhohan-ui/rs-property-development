'use client';

import React, { useState, useEffect } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { MapPin, Phone, MessageCircle, Share2, Maximize2, ShieldCheck, Mail } from 'lucide-react';
import { PlotCard } from '@/components/ui/PlotCard';

interface ListingDetailTemplateProps {
  slug: string;
  category: string;
}

export default function ListingDetailTemplate({ slug, category }: ListingDetailTemplateProps) {
  const [property, setProperty] = useState<any>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const q = query(
          collection(dbClient, 'properties'), 
          where('slug', '==', slug),
          where('category', '==', category)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const mainProperty = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
          setProperty(mainProperty);

          // Fetch similar properties
          const simQ = query(
            collection(dbClient, 'properties'),
            where('category', '==', category),
            where('status', '==', 'Available')
          );
          const simSnap = await getDocs(simQ);
          const similar = simSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== mainProperty.id)
            .slice(0, 3);
          setSimilarProperties(similar);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug, category]);

  if (loading) {
    return <div className="min-h-screen pt-24 pb-12 flex items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div><p className="mt-4 text-muted-foreground">Loading details...</p></div></div>;
  }

  if (!property) {
    return <div className="min-h-screen pt-24 pb-12 flex items-center justify-center text-xl text-muted-foreground">Property not found.</div>;
  }

  const allImages = [property.image, ...(property.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-28 lg:pb-12">
      <div className="container">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{property.type}</span>
              {property.status === 'Available' && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Available</span>}
              {property.verified && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><ShieldCheck size={14} /> Verified</span>}
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground gap-2">
              <MapPin size={18} />
              <span>{property.address || property.district}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground mb-1">Asking Price</p>
            <div className="text-3xl font-bold text-primary">{property.price}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-4">
                <Image src={allImages[activeImage]} alt="Property Image" fill className="object-cover" />
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory touch-pan-x scrollbar-hide">
                  {allImages.map((img: string, idx: number) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={`relative h-20 w-32 flex-shrink-0 rounded-md overflow-hidden border-2 snap-center ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}>
                      <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {property.description || 'No description provided.'}
              </div>
            </div>

            {/* Location Map */}
            {property.googleMapUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Location Map</h2>
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <iframe src={property.googleMapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Floating Card */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:sticky lg:top-24 lg:z-10 lg:p-6 lg:rounded-xl lg:bg-white lg:dark:bg-gray-800 lg:border lg:shadow-sm">
              <h3 className="hidden lg:block font-bold text-lg mb-4">Interested in this property?</h3>
              <div className="flex flex-row lg:flex-col gap-2 lg:gap-3">
                <a href={`tel:${property.contactNumber || '+8801814963730'}`} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 lg:py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm lg:text-base">
                  <Phone size={18} /> <span className="hidden sm:inline">Call</span>
                </a>
                <a href={`https://wa.me/${(property.whatsappNumber || '+8801814963730').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 lg:py-3 rounded-lg font-medium hover:bg-[#20b858] transition-colors text-sm lg:text-base">
                  <MessageCircle size={18} /> <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <button className="hidden lg:flex items-center justify-center w-full gap-2 border border-input bg-background py-3 rounded-lg font-medium hover:bg-accent transition-colors">
                  <Mail size={18} /> Send Email Inquiry
                </button>
                <div className="hidden lg:flex pt-4 mt-4 border-t justify-center gap-4 text-muted-foreground">
                  <button className="flex flex-col items-center hover:text-primary transition-colors"><Share2 size={20} /><span className="text-xs mt-1">Share</span></button>
                </div>
              </div>
            </div>

            {/* Quick Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border">
              <h3 className="font-bold text-lg mb-4">Quick Details</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Property ID</span><span className="font-medium">{property.id.slice(0, 8).toUpperCase()}</span></li>
                <li className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Category</span><span className="font-medium">{property.category}</span></li>
                <li className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Type</span><span className="font-medium">{property.type}</span></li>
                <li className="flex justify-between border-b pb-2"><span className="text-muted-foreground">Size</span><span className="font-medium">{property.size || 'N/A'}</span></li>
                {property.district && <li className="flex justify-between pb-2"><span className="text-muted-foreground">District</span><span className="font-medium">{property.district}</span></li>}
              </ul>
            </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar {category}s</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PlotCard
                  key={prop.id}
                  id={prop.id}
                  slug={`${category.toLowerCase().replace(/ /g, '-')}/${prop.slug}`}
                  title={prop.title}
                  location={prop.address || prop.district || 'Location unlisted'}
                  price={prop.price}
                  size={prop.size}
                  type={prop.type}
                  verified={prop.verified}
                  image={prop.image || prop.images?.[0]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
