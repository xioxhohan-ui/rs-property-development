'use client';

import React, { useState } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2, Save } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'new': 'bg-blue-100 text-blue-800 border-blue-200',
  'contacted': 'bg-amber-100 text-amber-800 border-amber-200',
  'follow_up': 'bg-purple-100 text-purple-800 border-purple-200',
  'qualified': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'closed': 'bg-gray-100 text-gray-800 border-gray-200',
  'sold': 'bg-green-100 text-green-800 border-green-200',
};

const formatStatus = (status: string) => {
  if (!status) return 'New';
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

interface InquiryCRMClientProps {
  inquiryId: string;
  initialStatus: string;
  initialNotes: string;
  type: string;
}

export function InquiryCRMClient({ inquiryId, initialStatus, initialNotes, type }: InquiryCRMClientProps) {
  const [status, setStatus] = useState(initialStatus || 'new');
  const [notes, setNotes] = useState(initialNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const colName = type === 'seller' ? 'seller_inquiries' : 'property_inquiries';

  const handleStatusChange = async (newStatus: string) => {
    try {
      setStatus(newStatus);
      await updateDoc(doc(dbClient, colName, inquiryId), { status: newStatus });
      toast.success('Status Updated', `Inquiry moved to ${formatStatus(newStatus)}`);
    } catch (error) {
      toast.error('Update Failed', 'Failed to update inquiry status');
      setStatus(status); // revert
    }
  };

  const handleNotesSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(dbClient, colName, inquiryId), { adminNotes: notes });
      toast.success('Notes Saved successfully');
    } catch (error) {
      toast.error('Save Failed', 'Failed to save admin notes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Management */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="bg-muted/50 px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Manage Lead Status
          </h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {['new', 'contacted', 'follow_up', 'qualified', 'closed', 'sold'].map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  status === s 
                    ? `${STATUS_COLORS[s]} border-transparent ring-2 ring-primary ring-offset-1 dark:ring-offset-background shadow-sm` 
                    : 'bg-background text-muted-foreground hover:bg-muted border-input'
                }`}
              >
                {formatStatus(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="bg-muted/50 px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            Internal CRM Notes
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Private</span>
          </h3>
          <button 
            onClick={handleNotesSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
        <div className="p-5">
          <textarea 
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add private notes about this lead here... (e.g. Spoke with client, looking for 3 beds, budget 5M, calling back on Monday)"
            className="w-full rounded-xl border-input bg-muted/30 p-3 text-sm focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary resize-y"
          />
        </div>
      </div>
    </div>
  );
}
