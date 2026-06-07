import React from 'react';
import { db } from '@/lib/firebase/admin';
import { Mail, Phone, Calendar, Search, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getInquiries() {
  try {
    const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    }) as any[];
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return [];
  }
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Inquiries</h1>
        <p className="text-muted-foreground mt-1">
          Review messages sent via the contact form and property pages.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
            />
          </div>
        </div>
        
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle whitespace-nowrap">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="font-medium">{inq.name || 'Anonymous'}</div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-1 text-xs text-muted-foreground">
                      {inq.email && (
                        <span className="flex items-center"><Mail className="mr-1 h-3 w-3"/> {inq.email}</span>
                      )}
                      {inq.phone && (
                        <span className="flex items-center"><Phone className="mr-1 h-3 w-3"/> {inq.phone}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle max-w-xs truncate" title={inq.message}>
                    {inq.subject || inq.message?.substring(0, 50) + '...'}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      inq.status === 'Resolved' ? 'bg-green-100 text-green-800 border-transparent' : 
                      inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border-transparent' : 
                      'bg-yellow-100 text-yellow-800 border-transparent'
                    }`}>
                      {inq.status || 'New'}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-secondary h-8 px-3 py-1 border text-primary">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No inquiries found. When customers use the contact form, they will appear here.
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
