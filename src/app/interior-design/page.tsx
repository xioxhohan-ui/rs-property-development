import React from 'react';
import ListingPageTemplate from '@/components/listings/ListingPageTemplate';

export const metadata = {
  title: 'Interior Design Projects | RS Property Development',
  description: 'Explore our premium interior design portfolio for residential, commercial, and office spaces.',
};

export default function InteriorDesignPage() {
  return (
    <ListingPageTemplate 
      title="Interior Design" 
      subtitle="Transform your space. View our modern and luxurious interior design projects across Bangladesh."
      category="Interior Design"
    />
  );
}
