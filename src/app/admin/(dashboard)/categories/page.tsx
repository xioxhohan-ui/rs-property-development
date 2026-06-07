import React from 'react';
import { db } from '@/lib/firebase/admin';
import AdminCategoriesClient from './_components/AdminCategoriesClient';

export const dynamic = 'force-dynamic';

async function getCategories() {
  try {
    const snapshot = await db.collection('categories').orderBy('order').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    }) as any[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your global property categories.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <AdminCategoriesClient initialCategories={categories} />
      </div>
    </div>
  );
}
