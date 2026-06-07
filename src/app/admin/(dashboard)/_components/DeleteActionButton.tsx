'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient } from '@/lib/firebase/client';
import { doc, deleteDoc } from 'firebase/firestore';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteActionButtonProps {
  collectionName: string;
  documentId: string;
}

export default function DeleteActionButton({ collectionName, documentId }: DeleteActionButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${collectionName.slice(0, -1)}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteDoc(doc(dbClient, collectionName, documentId));
      router.refresh();
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      alert('Failed to delete. Please try again.');
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
