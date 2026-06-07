import React from 'react';
import { db } from '@/lib/firebase/admin';
import BlogForm from '../_components/BlogForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBlog(id: string) {
  try {
    const doc = await db.collection('blogs').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data() || {};
    delete data.createdAt;
    delete data.updatedAt;
    return { id: doc.id, ...data } as any;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground mt-1">
          Update the content for "{blog.title || 'Untitled'}".
        </p>
      </div>

      <BlogForm mode="edit" initialData={blog} />
    </div>
  );
}
