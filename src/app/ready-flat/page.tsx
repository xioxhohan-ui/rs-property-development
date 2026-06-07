import React from 'react';
import ListingPageTemplate from '@/components/listings/ListingPageTemplate';

export const metadata = {
  title: 'Ready Flats & Apartments | RS Property Development',
  description: 'Browse ready-to-move apartments, luxury flats, and studio apartments across Bangladesh.',
};

export default function ReadyFlatPage() {
  return (
    <ListingPageTemplate 
      title="Ready Flats & Apartments" 
      subtitle="Find your perfect home. Explore our curated list of ready-to-move flats and luxury apartments."
      category="Ready Flat"
    />
  );
}
