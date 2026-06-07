'use client';

import React, { useState } from 'react';
import { dbClient } from '@/lib/firebase/client';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/Toast';

export default function AdminCategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setLoading(true);
    try {
      const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newCategoryData = {
        title: newTitle,
        slug,
        order: categories.length,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(dbClient, 'categories'), newCategoryData);
      setCategories([...categories, { 
        id: docRef.id, 
        title: newTitle,
        slug,
        order: categories.length,
        createdAt: new Date().toISOString()
      }]);
      setNewTitle('');
      toast.success('Category Added', `Successfully added category "${newTitle}".`);
      router.refresh();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Add Failed', 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category?',
      danger: true,
      confirmLabel: 'Delete'
    });
    if (!ok) return;

    try {
      await deleteDoc(doc(dbClient, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category Deleted');
      router.refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Delete Failed', 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">New Category Title</label>
          <input 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
            placeholder="e.g. Commercial Spaces"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !newTitle.trim()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 h-10"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add
        </button>
      </form>

      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 font-medium text-muted-foreground">Title</th>
              <th className="p-4 font-medium text-muted-foreground">Slug</th>
              <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 font-medium">{cat.title}</td>
                <td className="p-4 text-muted-foreground">{cat.slug}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="inline-flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 h-8 w-8 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-muted-foreground">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
