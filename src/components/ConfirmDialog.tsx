import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  isLoading = false,
}) => {
  const footer = (
    <>
      <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </button>
      <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="shimmer" style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            Processing...
          </>
        ) : (
          <>
            <Trash2 size={16} />
            {confirmText}
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <div 
          style={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            backgroundColor: 'var(--danger-light)', 
            color: 'var(--danger)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <AlertTriangle size={32} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
