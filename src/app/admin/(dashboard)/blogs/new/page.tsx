import React from 'react';
import BlogForm from '../_components/BlogForm';

export default function NewBlogPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground mt-1">
          Write a new blog post or news article.
        </p>
      </div>

      <BlogForm mode="create" />
    </div>
  );
}
