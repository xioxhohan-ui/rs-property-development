'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient } from '@/lib/firebase/client';
import { doc, deleteDoc } from 'firebase/firestore';
import { Trash2, Loader2 } from 'lucide-react';

import { useToast } from '@/components/ui/Toast';

interface DeleteActionButtonProps {
  collectionName: string;
  documentId: string;
}

export default function DeleteActionButton({ collectionName, documentId }: DeleteActionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    const isOk = await toast.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this ${collectionName.slice(0, -1)}? This action cannot be undone.`,
      danger: true,
      confirmLabel: 'Delete',
    });

    if (!isOk) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(dbClient, collectionName, documentId));
      toast.success('Deleted', 'Item has been deleted successfully.');
      router.refresh();
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      toast.error('Delete Failed', 'Failed to delete the item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-destructive/10 h-8 w-8 text-destructive disabled:opacity-50"
      title="Delete"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
