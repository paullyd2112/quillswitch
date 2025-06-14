
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useFocusTrap from '@/hooks/useFocusTrap';
import { useProcessing } from '@/contexts/ProcessingContext';

interface EnhancedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  preventBackgroundInteraction?: boolean;
  processingMessage?: string;
}

export const EnhancedModal: React.FC<EnhancedModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  preventBackgroundInteraction = true,
  processingMessage
}) => {
  const { isProcessing, setProcessing } = useProcessing();
  
  // Lock body scroll when modal is open
  useBodyScrollLock({ 
    enabled: isOpen && preventBackgroundInteraction 
  });

  // Set up focus trap
  const focusTrapRef = useFocusTrap({ 
    enabled: isOpen,
    autoFocus: true,
    restoreFocus: true 
  });

  // Handle processing state
  React.useEffect(() => {
    if (processingMessage) {
      setProcessing(true, processingMessage);
      return () => setProcessing(false);
    }
  }, [processingMessage, setProcessing]);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={className}
        ref={focusTrapRef}
        onPointerDownOutside={(e) => {
          if (preventBackgroundInteraction || isProcessing) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isProcessing) {
            e.preventDefault();
          }
        }}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedModal;
