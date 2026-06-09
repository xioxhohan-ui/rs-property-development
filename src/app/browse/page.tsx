import React from 'react';
import BrowseClient from './BrowseClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Marketplace | RS Property Development',
  description: 'Browse the latest premium real estate properties, lands, ready flats, and interior designs across Bangladesh.',
};

export default function BrowsePage() {
  return <BrowseClient />;
}
