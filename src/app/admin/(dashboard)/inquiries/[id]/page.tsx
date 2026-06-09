import React from 'react';
import { db } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import { Phone, Mail, MessageCircle, ArrowLeft, Building2, MapPin, Calendar, CheckCircle2, Link as LinkIcon, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getInquiry(id: string, type: string) {
  try {
    const colName = type === 'seller' ? 'seller_inquiries' : 'property_inquiries';
    const doc = await db.collection(colName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as any;
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return null;
  }
}

const formatStatus = (status: string) => {
  if (!status) return 'New';
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const STATUS_COLORS: Record<string, string> = {
  'new': 'bg-blue-100 text-blue-800 border-blue-200',
  'contacted': 'bg-amber-100 text-amber-800 border-amber-200',
  'follow_up': 'bg-purple-100 text-purple-800 border-purple-200',
  'qualified': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'closed': 'bg-gray-100 text-gray-800 border-gray-200',
  'sold': 'bg-green-100 text-green-800 border-green-200',
};

export default async function InquiryDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params;
  const sp = await searchParams;
  const type = (sp.type as string) || 'property';

  const inquiry = await getInquiry(id, type);

  if (!inquiry) {
    notFound();
  }

  const isSeller = type === 'seller';

  const propertyUrl = inquiry.propertySlug && inquiry.category 
    ? `/${inquiry.category.toLowerCase().replace(' ', '-')}/${inquiry.propertySlug}`
    : null;
    
  const customerPhone = inquiry.customerPhone || inquiry.phone || '';
  const customerName = inquiry.customerName || inquiry.fullName || 'Unknown';
  const customerEmail = inquiry.customerEmail || inquiry.email || '';
  const message = inquiry.message || inquiry.description || 'No message provided.';
  const whatsappLink = `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/inquiries">
          <button className="h-10 w-10 rounded-full bg-card border shadow-sm flex items-center justify-center hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {isSeller ? 'Seller Inquiry Details' : 'Property Inquiry Details'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[inquiry.status] || 'bg-gray-100'}`}>
              {formatStatus(inquiry.status)}
            </span>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> 
            Received on {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleString() : 'Recently'}
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
                <User className="h-4 w-4 text-primary" /> {isSeller ? 'Seller Profile' : 'Customer Profile'}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Full Name</label>
                <div className="font-medium text-lg">{customerName}</div>
              </div>
              
              <div className="pt-3 border-t">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Contact Details</label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {customerPhone}
                    </div>
                    <a href={`tel:${customerPhone}`} className="text-xs font-medium text-blue-600 hover:underline">Call</a>
                  </div>
                  {customerEmail && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{customerEmail}</span>
                      </div>
                      <a href={`mailto:${customerEmail}`} className="text-xs font-medium text-blue-600 hover:underline">Email</a>
                    </div>
                  )}
                  {inquiry.whatsapp && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle className="h-4 w-4 text-[#25D366]" />
                        <span className="truncate max-w-[150px]">{inquiry.whatsapp} (WhatsApp)</span>
                      </div>
                      <a href={`https://wa.me/${inquiry.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="text-xs font-medium text-[#25D366] hover:underline">Chat</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t">
                <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Preferred Method</label>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium">
                  {inquiry.preferredContactMethod === 'WhatsApp' || isSeller ? <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" /> : <Phone className="h-3.5 w-3.5 text-primary" />}
                  {inquiry.preferredContactMethod || (isSeller ? 'Any' : 'Phone Call')}
                </div>
              </div>
            </div>
          </div>

          {/* Property Card */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-muted/50 px-5 py-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> {isSeller ? 'Property Being Sold' : 'Property Interested In'}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="font-medium text-primary text-lg leading-tight mb-2">
                  {propertyUrl ? (
                    <a href={propertyUrl} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-start gap-2">
                      {inquiry.propertyTitle}
                      <LinkIcon className="h-3.5 w-3.5 mt-1 flex-shrink-0" />
                    </a>
                  ) : (
                    <span>{inquiry.propertyTitle}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-secondary">
                    {inquiry.category}
                  </span>
                  {inquiry.propertyId && (
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                      ID: {inquiry.propertyId.slice(0, 8)}
                    </span>
                  )}
                </div>
              </div>

              {isSeller && (
                <div className="space-y-2 mt-4 text-sm border-t pt-3">
                  <p><strong>District:</strong> {inquiry.district}</p>
                  <p><strong>Area:</strong> {inquiry.area}</p>
                  <p><strong>Address:</strong> {inquiry.address}</p>
                  <p><strong>Expected Price:</strong> BDT {inquiry.expectedPrice}</p>
                  {inquiry.googleMapUrl && (
                    <a href={inquiry.googleMapUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 mt-2">
                      <ExternalLink className="h-3 w-3" /> View on Map
                    </a>
                  )}
                </div>
              )}
              
              <div className="pt-3 border-t text-sm text-muted-foreground flex justify-between">
                <span>Source: <span className="text-foreground font-medium">{inquiry.source || (isSeller ? 'Seller Form' : 'Website')}</span></span>
                {inquiry.ipRegion && <span>Region: <span className="text-foreground font-medium">{inquiry.ipRegion}</span></span>}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Actions & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-card border rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${customerPhone}`} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground h-11 px-6 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                <Phone className="h-4 w-4" /> Call {isSeller ? 'Seller' : 'Customer'}
              </a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white h-11 px-6 rounded-md text-sm font-medium hover:bg-[#20b858] transition-colors shadow-sm">
                <MessageCircle className="h-4 w-4" /> Open WhatsApp
              </a>
              {customerEmail && (
                <a href={`mailto:${customerEmail}`} className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground h-11 px-6 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                  <Mail className="h-4 w-4" /> Send Email
                </a>
              )}
            </div>
          </div>

          {/* Customer Message */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-muted/50 px-5 py-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" /> {isSeller ? 'Property Description / Notes' : 'Customer Message'}
              </h3>
            </div>
            <div className="p-5">
              <div className="bg-blue-50/50 dark:bg-blue-950/20 text-foreground rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed border border-blue-100 dark:border-blue-900/50">
                {message}
              </div>
              {isSeller && inquiry.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2 text-sm">Additional Notes:</h4>
                  <div className="bg-muted/30 text-foreground rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed border border-border">
                    {inquiry.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive CRM Client Component (Status & Notes) */}
          <InquiryCRMClient inquiryId={inquiry.id} initialStatus={inquiry.status} initialNotes={inquiry.adminNotes} type={type} />

        </div>
      </div>
    </div>
  );
}

// Inline client component for managing the specific inquiry's CRM data
import { InquiryCRMClient } from './_components/InquiryCRMClient';
