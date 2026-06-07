import React from 'react';
import ListingDetailTemplate from '@/components/listings/ListingDetailTemplate';

// Generate dynamic metadata in a real app by querying Firebase here using generateMetadata

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  return <ListingDetailTemplate slug={params.slug} category="Property" />;
}
