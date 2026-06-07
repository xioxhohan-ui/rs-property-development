'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbClient } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { ShieldAlert, UserX, UserCheck, Loader2 } from 'lucide-react';

export default function UserActionButtons({ userId, currentStatus, currentRole }: { userId: string, currentStatus: string, currentRole: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (!window.confirm(`Are you sure you want to change user status to ${newStatus}?`)) return;
    
    setLoading(newStatus);
    try {
      await updateDoc(doc(dbClient, 'users', userId), { status: newStatus });
      router.refresh();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update status. Ensure you have Super Admin privileges.');
    } finally {
      setLoading(null);
    }
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setLoading('role');
    try {
      await updateDoc(doc(dbClient, 'users', userId), { role: newRole });
      router.refresh();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update role. Ensure you have Super Admin privileges.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 mr-4">
        <label className="text-sm font-medium">Role:</label>
        <select 
          disabled={loading === 'role'}
          value={currentRole || 'user'}
          onChange={handleRoleChange}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        >
          <option value="user">User</option>
          <option value="agent">Agent</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        {loading === 'role' && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
      </div>

      {currentStatus !== 'active' ? (
        <button 
          disabled={!!loading}
          onClick={() => handleStatusChange('active')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 bg-green-100 text-green-800 hover:bg-green-200 h-9 px-4 py-2"
        >
          {loading === 'active' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
          Activate Account
        </button>
      ) : (
        <button 
          disabled={!!loading}
          onClick={() => handleStatusChange('suspended')}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 h-9 px-4 py-2"
        >
          {loading === 'suspended' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
          Suspend User
        </button>
      )}

      <button 
        disabled={!!loading}
        onClick={() => handleStatusChange('banned')}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 px-4 py-2"
      >
        {loading === 'banned' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserX className="mr-2 h-4 w-4" />}
        Ban User
      </button>
    </div>
  );
}
