'use client';

import React, { useState, useEffect } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Loader2, Globe, Share2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  
  const [siteName, setSiteName] = useState('RS Property Development');
  const [metaTitle, setMetaTitle] = useState('RS Property | Luxury Real Estate');
  const [metaDesc, setMetaDesc] = useState('Discover the finest plots and properties in Bangladesh.');
  const [keywords, setKeywords] = useState('real estate, property, purbachal, dhaka, plots');
  const [ogImage, setOgImage] = useState('');
  const [contactEmail, setContactEmail] = useState('info@rsproperty.com');
  const [contactPhone, setContactPhone] = useState('+880 123 456 789');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(dbClient, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteName(data.siteName || siteName);
          setMetaTitle(data.metaTitle || metaTitle);
          setMetaDesc(data.metaDesc || metaDesc);
          setKeywords(data.keywords || keywords);
          setOgImage(data.ogImage || ogImage);
          setContactEmail(data.contactEmail || contactEmail);
          setContactPhone(data.contactPhone || contactPhone);
        }
      } catch (err) {
        console.error("Error fetching settings", err);
      } finally {
        setFetching(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    try {
      await setDoc(doc(dbClient, 'settings', 'global'), {
        siteName,
        metaTitle,
        metaDesc,
        keywords,
        ogImage,
        contactEmail,
        contactPhone,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Error saving settings", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your website's global SEO, branding, and contact details.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 pb-12">
        {success && (
          <div className="p-4 rounded-md bg-green-500/15 text-green-600 text-sm font-medium border border-green-500/20">
            {success}
          </div>
        )}

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Search Engine Optimization (SEO)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <p className="text-xs text-muted-foreground">Used as the base name for title tags.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Meta Title</label>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Default Meta Description</label>
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Keywords</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <div className="flex items-center gap-2 mb-6 border-b pb-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Social Media Sharing (OpenGraph)</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Social Share Image (URL)</label>
              <input type="url" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              <p className="text-xs text-muted-foreground">This image appears when your website is shared on Facebook, WhatsApp, LinkedIn, etc.</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Global Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Settings</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
