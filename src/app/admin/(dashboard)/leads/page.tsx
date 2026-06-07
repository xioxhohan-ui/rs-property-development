import React from 'react';
import { db } from '@/lib/firebase/admin';
import { Mail, Phone, MapPin, Search, Star, MessageSquare, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getLeads() {
  try {
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    }) as any[];
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
        <p className="text-muted-foreground mt-1">
          Track potential buyers and property inquiries.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads by name, email or property..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            />
          </div>
        </div>
        
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[250px]">Contact Info</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Property of Interest</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Score / Quality</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">Status</th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    <div className="font-semibold text-primary">{lead.name || 'Anonymous Lead'}</div>
                    <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                      {lead.email && (
                        <span className="flex items-center"><Mail className="mr-1 h-3 w-3"/> {lead.email}</span>
                      )}
                      {lead.phone && (
                        <span className="flex items-center"><Phone className="mr-1 h-3 w-3"/> {lead.phone}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    {lead.propertyTitle ? (
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium line-clamp-1">{lead.propertyTitle}</div>
                          {lead.propertyId && (
                            <div className="text-xs text-muted-foreground font-mono">ID: {lead.propertyId.substring(0,8)}</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">General Inquiry</span>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3 w-3 ${star <= (lead.score || 1) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <select 
                      defaultValue={lead.status || 'New'}
                      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-secondary h-8 w-8 text-primary border border-transparent hover:border-border" title="Add Note">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">No leads yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">Lead captures from property pages will appear here.</p>
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
