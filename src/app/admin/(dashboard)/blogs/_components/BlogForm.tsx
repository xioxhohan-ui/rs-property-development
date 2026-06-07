'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient, storage } from '@/lib/firebase/client';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill-new to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface BlogFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
}

export default function BlogForm({ mode, initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [status, setStatus] = useState(initialData?.status || 'Published');
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.seo?.description || '');
  const [metaKeywords, setMetaKeywords] = useState(initialData?.seo?.keywords || '');

  // Images
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.image || '');

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (mode === 'create') {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
      if (!metaTitle || metaTitle.startsWith(title)) {
        setMetaTitle(`${newTitle} | RS Property Blog`);
      }
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalCoverUrl = coverImageUrl;

      // Upload Cover Image if a file was selected
      if (coverImage) {
        const fileRef = ref(storage, `blogs/${Date.now()}_${coverImage.name}`);
        const snapshot = await uploadBytes(fileRef, coverImage);
        finalCoverUrl = await getDownloadURL(snapshot.ref);
      }

      const blogData = {
        title,
        slug,
        excerpt,
        content,
        status,
        image: finalCoverUrl,
        seo: {
          title: metaTitle || title,
          description: metaDescription || excerpt,
          keywords: metaKeywords,
        },
        updatedAt: serverTimestamp(),
      };

      if (mode === 'create') {
        await addDoc(collection(dbClient, 'blogs'), {
          ...blogData,
          author: 'Admin', // Static for now, can be linked to current user later
          date: new Date().toISOString(),
          createdAt: serverTimestamp(),
        });
      } else if (initialData?.id) {
        const docRef = doc(dbClient, 'blogs', initialData.id);
        await updateDoc(docRef, blogData);
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err: any) {
      console.error('Error saving blog:', err);
      setError('Failed to save blog post. ' + err.message);
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
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Post Details</h2>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Title *</label>
            <input required value={title} onChange={handleTitleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter post title" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug *</label>
              <input required value={slug} onChange={(e) => setSlug(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm" placeholder="post-url-slug" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status *</label>
              <select required value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt (Short Summary)</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Brief summary for the blog listing..." />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Cover Image</h2>
        <div className="space-y-2">
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
      </div>

      {/* Rich Text Editor */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Post Content *</h2>
        <div className="bg-background rounded-md overflow-hidden border border-input quill-admin-wrapper">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            className="h-[400px] mb-12"
          />
        </div>
      </div>

      {/* SEO Settings */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 border-blue-500/20">
        <div className="flex items-center justify-between mb-6 border-b pb-2">
          <h2 className="text-xl font-semibold flex items-center text-blue-600 dark:text-blue-400">
            <span className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            Automated SEO Metadata
          </h2>
          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full font-medium">Auto-Generated</span>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              <span>SEO Meta Title</span>
              <span className={`text-xs ${metaTitle.length > 60 ? 'text-amber-500' : 'text-emerald-500'}`}>{metaTitle.length}/60 chars</span>
            </label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Leave blank to use post title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex justify-between">
              <span>SEO Meta Description</span>
              <span className={`text-xs ${metaDescription.length > 160 ? 'text-amber-500' : 'text-emerald-500'}`}>{metaDescription.length}/160 chars</span>
            </label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Leave blank to use post excerpt" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meta Keywords (Comma separated)</label>
            <input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="real estate, blog, investment" />
          </div>
        </div>
        <div className="mt-4 p-4 bg-muted rounded-md border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Google Search Preview:</p>
          <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">{metaTitle || title || 'Post Title | RS Property Blog'}</div>
          <div className="text-emerald-700 text-sm truncate">https://rsproperty.com/blog/{slug || 'post-slug'}</div>
          <div className="text-sm text-foreground/80 line-clamp-2 mt-1">{metaDescription || excerpt || 'Post excerpt will appear here in search results.'}</div>
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
          disabled={loading || !content}
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            mode === 'create' ? 'Publish Post' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
