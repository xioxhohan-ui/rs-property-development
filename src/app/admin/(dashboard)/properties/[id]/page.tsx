import React from 'react';
import { db } from '@/lib/firebase/admin';
import PropertyForm from '../_components/PropertyForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getProperty(id: string) {
  try {
    const doc = await db.collection('plots').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-muted-foreground mt-1">
          Update the details for "{property.title}".
        </p>
      </div>

      <PropertyForm mode="edit" initialData={property} />
    </div>
  );
}
