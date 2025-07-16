import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, message }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm text-center">
        <div className="space-y-4 py-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Success!
            </h3>
            <p className="text-gray-600">
              {message}
            </p>
          </div>
          <Button 
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}