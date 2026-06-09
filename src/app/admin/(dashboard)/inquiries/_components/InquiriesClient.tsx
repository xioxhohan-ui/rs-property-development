'use client';

import React, { useState, useEffect } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/components/ui/Toast';
import { Search, Filter, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-amber-100 text-amber-800',
  'follow_up': 'bg-purple-100 text-purple-800',
  'qualified': 'bg-emerald-100 text-emerald-800',
  'closed': 'bg-gray-100 text-gray-800',
  'sold': 'bg-green-100 text-green-800',
};

const formatStatus = (status: string) => {
  if (!status) return 'New';
  return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default function InquiriesClient() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [sellerInquiries, setSellerInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSeller, setLoadingSeller] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'property' | 'seller'>('property');
  const router = useRouter();
  
  const toast = useToast();

  useEffect(() => {
    // Listen to property inquiries
    const qProp = query(collection(dbClient, 'property_inquiries'), orderBy('createdAt', 'desc'));
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    let initialLoadProp = true;

    const unsubProp = onSnapshot(qProp, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInquiries(data);
      setLoading(false);

      if (!initialLoadProp) {
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const inq = change.doc.data();
            toast.info('New Property Inquiry!', `${inq.customerName} is interested in ${inq.propertyTitle}`);
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('New Lead: RS Property', { body: `${inq.customerName} inquired about ${inq.propertyTitle}` });
            }
          }
        });
      }
      initialLoadProp = false;
    });

    // Listen to seller inquiries
    const qSeller = query(collection(dbClient, 'seller_inquiries'), orderBy('createdAt', 'desc'));
    let initialLoadSeller = true;

    const unsubSeller = onSnapshot(qSeller, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSellerInquiries(data);
      setLoadingSeller(false);

      if (!initialLoadSeller) {
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const inq = change.doc.data();
            toast.info('New Seller Inquiry!', `${inq.fullName} wants to sell ${inq.propertyTitle}`);
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('New Seller Inquiry', { body: `${inq.fullName} submitted a property` });
            }
          }
        });
      }
      initialLoadSeller = false;
    });

    return () => {
      unsubProp();
      unsubSeller();
    };
  }, [toast]);

  const handleDelete = async (id: string, e: React.MouseEvent, type: 'property'|'seller') => {
    e.stopPropagation();
    const ok = await toast.confirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to permanently delete this inquiry?',
      danger: true,
      confirmLabel: 'Delete'
    });
    if (!ok) return;

    try {
      await deleteDoc(doc(dbClient, type === 'property' ? 'property_inquiries' : 'seller_inquiries', id));
      toast.success('Inquiry Deleted');
    } catch (error) {
      toast.error('Delete Failed', 'Failed to delete inquiry');
    }
  };

  const currentList = activeTab === 'property' ? inquiries : sellerInquiries;

  const filteredInquiries = currentList.filter(inq => {
    if (filter !== 'All' && inq.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (inq.customerName || inq.fullName || '').toLowerCase();
      const phone = (inq.customerPhone || inq.phone || '').toLowerCase();
      const title = (inq.propertyTitle || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || title.includes(q);
    }
    return true;
  });

  const stats = {
    total: currentList.length,
    new: currentList.filter(i => i.status === 'new').length,
    qualified: currentList.filter(i => i.status === 'qualified').length,
    conversion: currentList.length > 0 ? Math.round((currentList.filter(i => i.status === 'qualified' || i.status === 'sold' || i.status === 'closed').length / currentList.length) * 100) : 0
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border pb-2">
        <button 
          onClick={() => setActiveTab('property')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'property' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          Property Inquiries
        </button>
        <button 
          onClick={() => setActiveTab('seller')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'seller' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          Seller Inquiries
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground mb-1">Total {activeTab === 'property' ? 'Inquiries' : 'Sellers'}</div>
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow Up</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

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
              {(activeTab === 'property' ? loading : loadingSeller) ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 mb-2 opacity-20" />
                      <p>No {activeTab === 'property' ? 'inquiries' : 'sellers'} found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className={`hover:bg-muted/30 transition-colors cursor-pointer ${inq.status === 'new' ? 'bg-blue-50/30' : ''}`} onClick={() => router.push(`/admin/inquiries/${inq.id}?type=${activeTab}`)}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{inq.customerName || inq.fullName}</div>
                      <div className="text-xs text-muted-foreground">{inq.preferredContactMethod || (activeTab === 'seller' ? 'Seller' : '')}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-foreground">{inq.customerPhone || inq.phone}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">{inq.customerEmail || inq.email}</div>
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
                        {formatStatus(inq.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/inquiries/${inq.id}?type=${activeTab}`); }} className="h-8 w-8 rounded flex items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={(e) => handleDelete(inq.id, e, activeTab)} className="h-8 w-8 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
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
    </div>
  );
}
