import React from 'react';
import ListingDetailTemplate from '@/components/listings/ListingDetailTemplate';

// Generate dynamic metadata in a real app by querying Firebase here using generateMetadata

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ListingDetailTemplate slug={slug} category="Property" />;
}
