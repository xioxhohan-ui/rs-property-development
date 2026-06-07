import React from 'react';
import { db } from '@/lib/firebase/admin';
import PropertyForm from '../../_components/PropertyForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProperty(collectionName: string, id: string) {
  try {
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as any;
  } catch (error) {
    console.error(`Error fetching property from ${collectionName}:`, error);
    return null;
  }
}

export default async function EditManageCollectionPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection: collectionName, id } = await params;
  
  if (!id || !collectionName) {
    notFound();
  }

  const property = await getProperty(collectionName, id);

  if (!property) {
    notFound();
  }

  const displayTitle = collectionName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit {displayTitle} Item</h1>
        <p className="text-muted-foreground mt-1">
          Update the details for "{property.title}".
        </p>
      </div>

      <PropertyForm mode="edit" initialData={property} collectionName={collectionName} />
    </div>
  );
}
