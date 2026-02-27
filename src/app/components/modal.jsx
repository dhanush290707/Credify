import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';










export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}) {
  // Close on ESC key
  useEscapeKey(() => {
    if (isOpen) {
      onClose();
    }
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
        aria-hidden="true" />
      

      {/* Modal Content */}
      <div
        className={`relative bg-background rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200`}
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        {(title || showCloseButton) &&
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {!title && <div />}
            {showCloseButton &&
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Close modal">
            
                <X size={20} />
              </button>
          }
          </div>
        }

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>);

}