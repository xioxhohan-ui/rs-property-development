import React from 'react';
import ListingPageTemplate from '@/components/listings/ListingPageTemplate';

export const metadata = {
  title: 'Real Estate Properties | RS Property Development',
  description: 'Browse our exclusive collection of residential and commercial properties across Bangladesh.',
};

export default function PropertyPage() {
  return (
    <ListingPageTemplate 
      title="Properties for Sale" 
      subtitle="Discover premium residential, commercial, and luxury properties tailored to your needs."
      category="Property"
    />
  );
}
