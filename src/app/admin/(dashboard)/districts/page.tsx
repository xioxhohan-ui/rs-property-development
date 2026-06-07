import React from 'react';
import { db } from '@/lib/firebase/admin';
import { Map, Plus, Edit, Trash2, Home } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDistricts() {
  try {
    const snapshot = await db.collection('districts').orderBy('name').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
}

export default async function AdminDistrictsPage() {
  const districts = await getDistricts();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operating Districts</h1>
          <p className="text-muted-foreground mt-1">
            Manage the locations where you have active properties.
          </p>
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="mr-2 h-4 w-4" /> Add District
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {districts.map((district) => (
          <div key={district.id} className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden flex flex-col">
            <div className="h-32 bg-muted relative group">
              {district.image ? (
                <img src={district.image} alt={district.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <Map className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-background/90 text-foreground p-1.5 rounded-md hover:bg-background">
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button className="bg-destructive/90 text-destructive-foreground p-1.5 rounded-md hover:bg-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg">{district.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm mt-1 mb-4">
                <Home className="h-3 w-3 mr-1" />
                <span>{district.propertyCount || 0} active properties</span>
              </div>
              <div className="mt-auto">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                  district.status === 'Active' ? 'bg-green-100 text-green-800 border-transparent' : 'bg-muted text-muted-foreground'
                }`}>
                  {district.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {districts.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-xl border border-dashed bg-card">
            <Map className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-foreground">No districts configured</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first operating district to organize properties.</p>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Add District
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
