import React from 'react';
import ListingDetailTemplate from '@/components/listings/ListingDetailTemplate';

export default function LandDetailPage({ params }: { params: { slug: string } }) {
  return <ListingDetailTemplate slug={params.slug} category="Land" />;
}
