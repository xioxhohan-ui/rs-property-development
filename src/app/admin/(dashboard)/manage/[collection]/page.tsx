import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/admin';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

import DeleteActionButton from '../../_components/DeleteActionButton';

export const dynamic = 'force-dynamic';

async function getProperties(collectionName: string) {
  try {
    const snapshot = await db.collection(collectionName).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
}

export default async function AdminManageCollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const resolvedParams = await params;
  const collectionName = resolvedParams.collection;
  const properties = await getProperties(collectionName);
  
  const displayTitle = collectionName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{displayTitle}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your {displayTitle.toLowerCase()} listings.
          </p>
        </div>
        <Link href={`/admin/manage/${collectionName}/new`}>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </button>
        </Link>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${displayTitle.toLowerCase()}...`}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            />
          </div>
        </div>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {properties.map((plot) => (
                <tr key={plot.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden">
                      {plot.image || plot.coverImage ? (
                        <img src={plot.image || plot.coverImage} alt={plot.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-secondary"></div>
                      )}
                    </div>
                    {plot.title}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                      {plot.category || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{plot.type || 'N/A'}</td>
                  <td className="p-4 align-middle">{plot.location || plot.district || plot.area}</td>
                  <td className="p-4 align-middle">{plot.price}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      plot.status === 'Available' || plot.status === 'Completed' || plot.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {plot.status || (plot.verified ? 'Available' : 'Pending')}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/manage/${collectionName}/${plot.id}`}>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-secondary h-8 w-8 text-primary">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <DeleteActionButton collectionName={collectionName} documentId={plot.id} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {properties.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No items found in {displayTitle}. Add your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
