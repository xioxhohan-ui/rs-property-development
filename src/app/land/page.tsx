import React from 'react';
import ListingPageTemplate from '@/components/listings/ListingPageTemplate';

export const metadata = {
  title: 'Land & Plots for Sale | RS Property Development',
  description: 'Explore verified residential, commercial, agricultural, and industrial land across Bangladesh.',
};

export default function LandPage() {
  return (
    <ListingPageTemplate 
      title="Land & Plots" 
      subtitle="Find the perfect plot to build your dream home or commercial project. Verified and secure."
      category="Land"
    />
  );
}
