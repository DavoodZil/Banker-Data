import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, message }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm text-center">
        <div className="space-y-4 py-4">
          <div className="w-16 h-16 bg-common-green-secondary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-common-green" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-common-gray-dark mb-2">
              Success!
            </h3>
            <p className="text-common-gray-dark">{message}</p>
          </div>
          <Button
            onClick={onClose}
            className="bg-common-green hover:bg-common-green-dark"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}








