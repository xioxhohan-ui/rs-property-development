import React from 'react';
import InquiriesClient from './_components/InquiriesClient';
import { Mailbox } from 'lucide-react';

export const metadata = {
  title: 'Inquiries CRM | RS Property Development',
  description: 'Manage real estate inquiries in real time.',
};

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mailbox className="h-8 w-8 text-primary" />
          Lead & Inquiry Management
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Track and respond to property inquiries in real time. Manage leads, track conversions, and add internal notes to stay organized.
        </p>
      </div>

      <InquiriesClient />
    </div>
  );
}
