import React from 'react';
import { db } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import { Phone, Mail, MessageCircle, ArrowLeft, Building2, Calendar, Link as LinkIcon, User } from 'lucide-react';
import Link from 'next/link';
import { LeadCRMClient } from './_components/LeadCRMClient';

export const dynamic = 'force-dynamic';

async function getLead(id: string) {
  try {
    const doc = await db.collection('leads').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as any;
  } catch (error) {
    console.error('Error fetching lead:', error);
    return null;
  }
}

const STATUS_COLORS: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-800 border-blue-200',
  'Contacted': 'bg-amber-100 text-amber-800 border-amber-200',
  'Qualified': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Lost': 'bg-gray-100 text-gray-800 border-gray-200',
  'Converted': 'bg-green-100 text-green-800 border-green-200',
};

export default async function LeadDetailPage({ 
  params,
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  const customerPhone = lead.phone || '';
  const customerName = lead.name || 'Anonymous Lead';
  const customerEmail = lead.email || '';
  const whatsappLink = customerPhone ? `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}` : '#';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/leads">
          <button className="h-10 w-10 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              Lead Details
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[lead.status || 'New'] || 'bg-gray-100'}`}>
              {lead.status || 'New'}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            Received on {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : 'Recently'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Customer & Property Info */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Customer Card */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-muted/50 px-5 py-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Customer Profile
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Name</label>
                <div className="font-medium text-lg">{customerName}</div>
              </div>
              
              <div className="pt-3 border-t">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Contact Details</label>
                <div className="space-y-3 mt-2">
                  {customerPhone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {customerPhone}
                      </div>
                      <a href={`tel:${customerPhone}`} className="text-xs font-medium text-blue-600 hover:underline">Call</a>
                    </div>
                  )}
                  {customerEmail && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{customerEmail}</span>
                      </div>
                      <a href={`mailto:${customerEmail}`} className="text-xs font-medium text-blue-600 hover:underline">Email</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Card */}
          {lead.propertyTitle && (
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <div className="bg-muted/50 px-5 py-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Property Interested In
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="font-medium text-primary text-lg leading-tight mb-2">
                    {lead.propertyUrl ? (
                      <a href={lead.propertyUrl} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-start gap-2">
                        {lead.propertyTitle}
                        <LinkIcon className="h-3.5 w-3.5 mt-1 flex-shrink-0" />
                      </a>
                    ) : (
                      <span>{lead.propertyTitle}</span>
                    )}
                  </div>
                  {lead.propertyId && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        ID: {lead.propertyId.slice(0, 8)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Actions & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-card border rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              {customerPhone && (
                <>
                  <a href={`tel:${customerPhone}`} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground h-11 px-6 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                    <Phone className="h-4 w-4" /> Call Customer
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white h-11 px-6 rounded-md text-sm font-medium hover:bg-[#20b858] transition-colors shadow-sm">
                    <MessageCircle className="h-4 w-4" /> Open WhatsApp
                  </a>
                </>
              )}
              {customerEmail && (
                <a href={`mailto:${customerEmail}`} className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground h-11 px-6 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Mail className="h-4 w-4" /> Send Email
                </a>
              )}
              {!customerPhone && !customerEmail && (
                <p className="text-sm text-muted-foreground italic">No contact information available for quick actions.</p>
              )}
            </div>
          </div>

          {/* Interactive CRM Client Component (Status & Notes) */}
          <LeadCRMClient leadId={lead.id} initialStatus={lead.status || 'New'} initialNotes={lead.adminNotes || lead.notes || ''} />

        </div>
      </div>
    </div>
  );
}
