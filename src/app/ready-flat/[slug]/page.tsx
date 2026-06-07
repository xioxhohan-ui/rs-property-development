import React from 'react';
import ListingDetailTemplate from '@/components/listings/ListingDetailTemplate';

export default async function ReadyFlatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ListingDetailTemplate slug={slug} category="Ready Flat" collectionName="ready_flats" />;
}
