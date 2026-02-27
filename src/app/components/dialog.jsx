
import { AlertTriangle, CheckCircle, Info, XCircle, AlertCircle } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';













export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'confirm',
  confirmText = 'OK',
  cancelText = 'Cancel',
  children
}) {
  useEscapeKey(() => {
    if (isOpen) {
      onClose();
    }
  });

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={48} />;
      case 'error':
        return <XCircle className="text-red-600" size={48} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={48} />;
      case 'info':
        return <Info className="text-blue-600" size={48} />;
      case 'alert':
        return <AlertCircle className="text-orange-600" size={48} />;
      default:
        return <AlertCircle className="text-blue-600" size={48} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'alert':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true" />
      

      {/* Dialog */}
      <div
        className="relative bg-background rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true">
        
        {/* Content */}
        <div className="p-6">
          {/* Icon and Title Section */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className={`mb-4 p-3 rounded-full ${getColors()}`}>
              {getIcon()}
            </div>
            
            {title &&
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            }
            
            <p className="text-muted-foreground text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Additional Content */}
          {children &&
          <div className="mb-4">
              {children}
            </div>
          }

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {type === 'confirm' || onConfirm ?
            <>
                <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-sm font-medium">
                
                  {cancelText}
                </button>
                <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm font-medium">
                
                  {confirmText}
                </button>
              </> :

            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm font-medium">
              
                {confirmText}
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

}

// Pre-configured dialog variants
export function ConfirmDialog(props) {
  return <Dialog {...props} type="confirm" />;
}

export function AlertDialog(props) {
  return <Dialog {...props} type="alert" confirmText="OK" />;
}

export function SuccessDialog(props) {
  return <Dialog {...props} type="success" confirmText="OK" />;
}

export function ErrorDialog(props) {
  return <Dialog {...props} type="error" confirmText="OK" />;
}

export function WarningDialog(props) {
  return <Dialog {...props} type="warning" />;
}

export function InfoDialog(props) {
  return <Dialog {...props} type="info" confirmText="Got it" />;
}