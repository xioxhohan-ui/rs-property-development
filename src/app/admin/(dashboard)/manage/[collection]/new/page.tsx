import React from 'react';
import PropertyForm from '../_components/PropertyForm';

export default async function NewManageCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const resolvedParams = await params;
  const collectionName = resolvedParams.collection;
  const displayTitle = collectionName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New {displayTitle}</h1>
        <p className="text-muted-foreground mt-1">
          Create a new listing in {displayTitle}.
        </p>
      </div>

      <PropertyForm mode="create" collectionName={collectionName} />
    </div>
  );
}
