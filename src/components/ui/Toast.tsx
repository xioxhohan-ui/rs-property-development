'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const COLORS: Record<ToastType, { bg: string; bar: string; iconBg: string; title: string; msg: string }> = {
  success: { bg: '#fff', bar: '#22c55e', iconBg: '#22c55e', title: '#0D0D0D', msg: '#5a6a7a' },
  error:   { bg: '#fff', bar: '#ef4444', iconBg: '#ef4444', title: '#0D0D0D', msg: '#5a6a7a' },
  warning: { bg: '#fff', bar: '#f59e0b', iconBg: '#f59e0b', title: '#0D0D0D', msg: '#5a6a7a' },
  info:    { bg: '#fff', bar: '#1E466B', iconBg: '#1E466B', title: '#0D0D0D', msg: '#5a6a7a' },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[toast.type];

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 4s
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, 4000);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        background: c.bg,
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.08)',
        padding: '16px 18px',
        minWidth: '300px',
        maxWidth: '380px',
        borderLeft: `4px solid ${c.bar}`,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(60px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: '3px', background: c.bar, opacity: 0.3,
        animation: 'toastProgress 4s linear forwards',
      }} />

      {/* Icon */}
      <div style={{
        flexShrink: 0,
        width: '36px', height: '36px',
        borderRadius: '10px',
        background: c.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${c.iconBg}40`,
      }}>
        {Icons[toast.type]}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: c.title, fontFamily: 'Inter,sans-serif', marginBottom: toast.message ? '3px' : 0 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: '13px', color: c.msg, fontFamily: 'Inter,sans-serif', lineHeight: 1.5 }}>
            {toast.message}
          </div>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}
        style={{
          flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
          color: '#9ca3af', padding: '2px', lineHeight: 1, borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

function ConfirmDialog({ opts, onClose }: { opts: ConfirmState; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handle = (val: boolean) => {
    setVisible(false);
    setTimeout(() => { opts.resolve(val); onClose(); }, 200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      background: `rgba(0,0,0,${visible ? 0.45 : 0})`,
      transition: 'background 0.2s ease',
      backdropFilter: 'blur(4px)',
    }}
      onClick={() => handle(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
        }}
      >
        {/* Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: opts.danger ? '#fef2f2' : 'rgba(30,70,107,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
        }}>
          {opts.danger ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1E466B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          )}
        </div>

        <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: '18px', color: '#0D0D0D', margin: '0 0 8px' }}>
          {opts.title}
        </h3>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#5a6a7a', margin: '0 0 28px', lineHeight: 1.6 }}>
          {opts.message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handle(false)}
            style={{
              height: '42px', padding: '0 20px', borderRadius: '10px',
              border: '1.5px solid #e2e8f0', background: '#fff',
              color: '#5a6a7a', fontSize: '14px', fontWeight: 600,
              fontFamily: 'Inter,sans-serif', cursor: 'pointer',
            }}
          >
            {opts.cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={() => handle(true)}
            style={{
              height: '42px', padding: '0 24px', borderRadius: '10px',
              border: 'none',
              background: opts.danger ? '#ef4444' : '#1E466B',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              fontFamily: 'Inter,sans-serif', cursor: 'pointer',
              boxShadow: opts.danger ? '0 4px 16px rgba(239,68,68,0.35)' : '0 4px 16px rgba(30,70,107,0.35)',
            }}
          >
            {opts.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]);
  }, []);

  const confirmFn = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmState({ ...opts, resolve });
    });
  }, []);

  const value: ToastContextValue = {
    success: (t, m) => addToast('success', t, m),
    error:   (t, m) => addToast('error', t, m),
    warning: (t, m) => addToast('warning', t, m),
    info:    (t, m) => addToast('info', t, m),
    confirm: confirmFn,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Stack */}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px',
        zIndex: 9998, display: 'flex', flexDirection: 'column', gap: '10px',
        alignItems: 'flex-end',
      }}>
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirmState && (
        <ConfirmDialog opts={confirmState} onClose={() => setConfirmState(null)} />
      )}
    </ToastContext.Provider>
  );
}
