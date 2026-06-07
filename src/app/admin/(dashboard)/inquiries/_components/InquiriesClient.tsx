'use client';

import React, { useState, useEffect } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/Toast';
import { Search, Filter, Phone, Mail, MessageCircle, MoreVertical, Trash2, Edit, X, Bell } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-800',
  'Contacted': 'bg-amber-100 text-amber-800',
  'Follow Up': 'bg-purple-100 text-purple-800',
  'Qualified': 'bg-emerald-100 text-emerald-800',
  'Closed': 'bg-gray-100 text-gray-800',
};

export default function InquiriesClient() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  
  const toast = useToast();

  useEffect(() => {
    const q = query(collection(dbClient, 'inquiries'), orderBy('createdAt', 'desc'));
    
    // Request notification permission if not granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    let initialLoad = true;

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInquiries(data);
      setLoading(false);

      // Notification for new inquiry (skip on initial load)
      if (!initialLoad) {
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const inq = change.doc.data();
            // Show toast notification
            toast.info('New Inquiry Received!', `${inq.name} is interested in ${inq.propertyTitle}`);
            
            // Show browser notification if permitted
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('New Lead: RS Property', {
                body: `${inq.name} inquired about ${inq.propertyTitle}`,
                icon: '/favicon.ico'
              });
            }
          }
        });
      }
      initialLoad = false;
    });

    return () => unsub();
  }, [toast]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(dbClient, 'inquiries', id), { status: newStatus });
      toast.success('Status Updated', `Inquiry moved to ${newStatus}`);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    } catch (error) {
      toast.error('Update Failed', 'Failed to update inquiry status');
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      await updateDoc(doc(dbClient, 'inquiries', id), { notes });
      toast.success('Notes Saved');
    } catch (error) {
      toast.error('Update Failed', 'Failed to save notes');
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to permanently delete this inquiry?',
      danger: true,
      confirmLabel: 'Delete'
    });
    if (!ok) return;

    try {
      await deleteDoc(doc(dbClient, 'inquiries', id));
      toast.success('Inquiry Deleted');
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch (error) {
      toast.error('Delete Failed', 'Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (filter !== 'All' && inq.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        (inq.name || '').toLowerCase().includes(q) ||
        (inq.phone || '').toLowerCase().includes(q) ||
        (inq.propertyTitle || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate stats
  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'New').length,
    qualified: inquiries.filter(i => i.status === 'Qualified').length,
    conversion: inquiries.length > 0 ? Math.round((inquiries.filter(i => i.status === 'Qualified' || i.status === 'Closed').length / inquiries.length) * 100) : 0
  };

  return (
    <div className="space-y-6">
      {/* Top Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total Inquiries</div>
          <div className="text-3xl font-bold text-primary">{stats.total}</div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-between">
            New Leads
            {stats.new > 0 && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Qualified</div>
          <div className="text-3xl font-bold text-emerald-600">{stats.qualified}</div>
        </div>
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-purple-600">{stats.conversion}%</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card border rounded-xl p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or property..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Qualified">Qualified</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium uppercase text-xs">Customer</th>
                <th className="px-5 py-4 font-medium uppercase text-xs">Contact</th>
                <th className="px-5 py-4 font-medium uppercase text-xs">Property</th>
                <th className="px-5 py-4 font-medium uppercase text-xs">Date</th>
                <th className="px-5 py-4 font-medium uppercase text-xs">Status</th>
                <th className="px-5 py-4 font-medium uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Loading inquiries...</td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 mb-2 opacity-20" />
                      <p>No inquiries found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className={`hover:bg-muted/30 transition-colors cursor-pointer ${inq.status === 'New' ? 'bg-blue-50/30' : ''}`} onClick={() => setSelectedInquiry(inq)}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{inq.name}</div>
                      <div className="text-xs text-muted-foreground">{inq.preferredContact}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-foreground">{inq.phone}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">{inq.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-foreground font-medium truncate max-w-[200px]">{inq.propertyTitle}</div>
                      <div className="text-xs text-muted-foreground">{inq.category}</div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {inq.createdAt ? new Date(inq.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[inq.status] || 'bg-gray-100 text-gray-800'}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <select 
                          value={inq.status}
                          onChange={(e) => updateStatus(inq.id, e.target.value)}
                          className="h-8 rounded text-xs border bg-background px-2"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow Up">Follow Up</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button onClick={() => handleDelete(inq.id)} className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedInquiry(null)}>
          <div className="bg-background w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Inquiry Details
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedInquiry.status] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedInquiry.status}
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground">Received on {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Customer Info</h3>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Full Name</div>
                      <div className="font-medium">{selectedInquiry.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Phone Number</div>
                      <div className="font-medium flex items-center gap-2">
                        {selectedInquiry.phone}
                        <div className="flex gap-1 ml-auto">
                          <a href={`tel:${selectedInquiry.phone}`} className="h-7 w-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200" title="Call">
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                          <a href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="h-7 w-7 rounded bg-[#dcf8c6] text-[#075e54] flex items-center justify-center hover:bg-[#25D366] hover:text-white" title="WhatsApp">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                    {selectedInquiry.email && (
                      <div>
                        <div className="text-xs text-muted-foreground">Email</div>
                        <div className="font-medium flex items-center gap-2">
                          {selectedInquiry.email}
                          <a href={`mailto:${selectedInquiry.email}`} className="ml-auto h-7 w-7 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-muted-foreground">Preferred Contact Method</div>
                      <div className="font-medium">{selectedInquiry.preferredContact || 'Not specified'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Property Info</h3>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Title</div>
                      <div className="font-medium text-primary">{selectedInquiry.propertyTitle}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div className="font-medium">{selectedInquiry.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Property ID</div>
                      <div className="font-mono text-xs mt-1">{selectedInquiry.propertyId}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Message</h3>
                  <div className="bg-blue-50 text-blue-900 rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed border border-blue-100">
                    "{selectedInquiry.message}"
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex justify-between items-center">
                    Internal Notes
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full normal-case">Private</span>
                  </h3>
                  <textarea 
                    rows={4}
                    defaultValue={selectedInquiry.notes || ''}
                    onBlur={(e) => {
                      if (e.target.value !== selectedInquiry.notes) {
                        updateNotes(selectedInquiry.id, e.target.value);
                        setSelectedInquiry({...selectedInquiry, notes: e.target.value});
                      }
                    }}
                    placeholder="Add private notes about this lead here... (Saves automatically when you click outside)"
                    className="w-full rounded-xl border-input bg-muted/30 p-3 text-sm focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary resize-y"
                  />
                </div>

                <div className="pt-4 border-t">
                  <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Change Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['New', 'Contacted', 'Follow Up', 'Qualified', 'Closed'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedInquiry.id, status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          selectedInquiry.status === status 
                            ? `${STATUS_COLORS[status]} border-transparent ring-2 ring-primary ring-offset-1` 
                            : 'bg-background text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
