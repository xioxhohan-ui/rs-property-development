import React from 'react';
import ListingDetailTemplate from '@/components/listings/ListingDetailTemplate';

export default function InteriorDesignDetailPage({ params }: { params: { slug: string } }) {
  return <ListingDetailTemplate slug={params.slug} category="Interior Design" />;
}
