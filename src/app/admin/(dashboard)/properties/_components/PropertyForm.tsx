'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient, storage } from '@/lib/firebase/client';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface PropertyFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function PropertyForm({ mode, initialData }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Basic Info
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [type, setType] = useState(initialData?.type || 'Residential');
  const [status, setStatus] = useState(initialData?.status || 'Available');
  
  // Location
  const [district, setDistrict] = useState(initialData?.district || 'Dhaka');
  const [area, setArea] = useState(initialData?.area || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [googleMapUrl, setGoogleMapUrl] = useState(initialData?.googleMapUrl || '');
  
  // Details
  const [price, setPrice] = useState(initialData?.price || '');
  const [size, setSize] = useState(initialData?.size || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [youtubeVideo, setYoutubeVideo] = useState(initialData?.youtubeVideo || '');
  
  // Toggles
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [verified, setVerified] = useState(initialData?.verified || false);

  // Images
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.image || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialData?.images || []);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (mode === 'create') {
      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput && !galleryUrls.includes(galleryUrlInput)) {
      setGalleryUrls([...galleryUrls, galleryUrlInput]);
      setGalleryUrlInput('');
    }
  };

  const removeGalleryUrl = (urlToRemove: string) => {
    setGalleryUrls(galleryUrls.filter(url => url !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalCoverUrl = coverImageUrl;

      // Upload Cover Image if a file was selected
      if (coverImage) {
        const fileRef = ref(storage, `properties/${Date.now()}_${coverImage.name}`);
        const snapshot = await uploadBytes(fileRef, coverImage);
        finalCoverUrl = await getDownloadURL(snapshot.ref);
      }

      const propertyData = {
        title,
        slug,
        type,
        status,
        district,
        area,
        address,
        googleMapUrl,
        price,
        size,
        description,
        youtubeVideo,
        featured,
        verified,
        image: finalCoverUrl,
        images: galleryUrls,
        updatedAt: serverTimestamp(),
      };

      if (mode === 'create') {
        await addDoc(collection(dbClient, 'plots'), {
          ...propertyData,
          createdAt: serverTimestamp(),
        });
      } else if (initialData?.id) {
        const docRef = doc(dbClient, 'plots', initialData.id);
        await updateDoc(docRef, propertyData);
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (err: any) {
      console.error('Error saving property:', err);
      setError('Failed to save property. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {error && (
        <div className="p-4 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Property Title *</label>
            <input required value={title} onChange={handleTitleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., Luxury Plot in Purbachal" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL Slug *</label>
            <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm" placeholder="luxury-plot-in-purbachal" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Property Type *</label>
            <select required value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Shop">Shop</option>
              <option value="Flat">Flat</option>
              <option value="Plot">Plot</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status *</label>
            <select required value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location & Details */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Location & Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">District *</label>
            <input required value={district} onChange={(e) => setDistrict(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., Dhaka" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Area</label>
            <input value={area} onChange={(e) => setArea(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., Sector 12" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Full Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full physical address" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price *</label>
            <input required value={price} onChange={(e) => setPrice(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., ৳ 1.5 Crore" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Land Size *</label>
            <input required value={size} onChange={(e) => setSize(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="e.g., 5 Katha" />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium">Property Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Describe the property..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Google Map URL</label>
            <input value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://maps.google.com/..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube Video URL</label>
            <input value={youtubeVideo} onChange={(e) => setYoutubeVideo(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>
      </div>

      {/* Media & Images */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Media & Images</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image</label>
            <div className="flex flex-col gap-4 sm:flex-row items-start sm:items-center">
              {coverImageUrl && !coverImage && (
                <div className="relative h-24 w-32 rounded-md overflow-hidden border">
                  <img src={coverImageUrl} alt="Cover" className="h-full w-full object-cover" />
                </div>
              )}
              {coverImage && (
                <div className="relative h-24 w-32 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
                  <span className="text-xs text-muted-foreground p-2 text-center">{coverImage.name}</span>
                </div>
              )}
              <div className="flex-1 space-y-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium" 
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">OR Paste URL:</span>
                  <input 
                    type="url" 
                    value={coverImageUrl} 
                    onChange={(e) => setCoverImageUrl(e.target.value)} 
                    placeholder="https://..." 
                    className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Gallery Images (URLs)</label>
            <div className="flex gap-2">
              <input 
                type="url" 
                value={galleryUrlInput} 
                onChange={(e) => setGalleryUrlInput(e.target.value)} 
                placeholder="Paste image URL here..." 
                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" 
              />
              <button 
                type="button" 
                onClick={handleAddGalleryUrl}
                className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                Add
              </button>
            </div>
            
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="relative group rounded-md overflow-hidden border h-24">
                    <img src={url} alt={`Gallery ${idx}`} className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeGalleryUrl(url)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options & Visibility */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Options & Visibility</h2>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={featured} 
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-input bg-background text-primary" 
            />
            <span className="text-sm font-medium">Featured Property (Shows on Homepage)</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={verified} 
              onChange={(e) => setVerified(e.target.checked)}
              className="h-5 w-5 rounded border-input bg-background text-primary" 
            />
            <span className="text-sm font-medium">Verified Property</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            mode === 'create' ? 'Publish Property' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
