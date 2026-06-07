'use client';

import React, { useState } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/components/ui/Toast';
import { Loader2 } from 'lucide-react';

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  category: string;
}

export default function InquiryForm({ propertyId, propertyTitle, propertySlug, category }: InquiryFormProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: 'I am interested in this property. Please contact me with more details.',
    preferredContact: 'Phone',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const batch = writeBatch(dbClient);

      const inquiryRef = doc(collection(dbClient, 'property_inquiries'));
      batch.set(inquiryRef, {
        propertyId,
        propertyTitle,
        propertySlug,
        category,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        message: form.message,
        preferredContactMethod: form.preferredContact,
        status: 'new',
        assignedAgent: '',
        adminNotes: '',
        source: 'Website',
        ipRegion: 'Unknown',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const leadRef = doc(collection(dbClient, 'leads'));
      batch.set(leadRef, {
        leadId: leadRef.id,
        inquiryId: inquiryRef.id,
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        propertyId,
        status: 'new',
        assignedAgent: '',
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      toast.success('Inquiry Sent', 'Thank you! We have received your inquiry and will contact you shortly.');
      setForm(prev => ({ ...prev, name: '', phone: '', email: '', message: 'I am interested in this property. Please contact me with more details.' }));
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Submission Failed', 'There was an error sending your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
        <input 
          required 
          type="text" 
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
          placeholder="John Doe" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Phone Number *</label>
          <input 
            required 
            type="tel" 
            value={form.phone}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
            placeholder="+8801..." 
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
          <input 
            type="email" 
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
            placeholder="john@example.com" 
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Preferred Contact</label>
        <select 
          value={form.preferredContact}
          onChange={(e) => setForm(prev => ({ ...prev, preferredContact: e.target.value }))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="Phone">Phone Call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Message *</label>
        <textarea 
          required 
          rows={4}
          value={form.message}
          onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" 
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all mt-4 shadow-sm"
        style={{ backgroundColor: '#1E466B', color: '#FFFFFF' }}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Inquiry'}
      </button>
    </form>
  );
}
