import React from 'react';
import ListingDetailTemplate from '@/components/listings/ListingDetailTemplate';

export default function ReadyFlatDetailPage({ params }: { params: { slug: string } }) {
  return <ListingDetailTemplate slug={params.slug} category="Ready Flat" />;
}
