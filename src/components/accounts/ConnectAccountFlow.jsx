import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Landmark, Loader2, ShieldCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { exchangePublicToken } from '@/api/functions';
import { usePlaidLinkToken } from '@/hooks/usePlaidLinkToken';

const StatusDisplay = ({ step, error, isReady }) => (
    <div className="text-center space-y-4 py-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors ${
            step === 'success' || (step === 'ready' && isReady) ? 'bg-emerald-100' : 
            step === 'error' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
            {step === 'loading' && <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />}
            {step === 'ready' && isReady && <ShieldCheck className="w-8 h-8 text-emerald-600" />}
            {step === 'success' && <CheckCircle className="w-8 h-8 text-emerald-600" />}
            {step === 'error' && <AlertTriangle className="w-8 h-8 text-red-600" />}
        </div>
        <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
                {step === 'loading' && "Preparing secure connection..."}
                {step === 'ready' && "Ready to Connect"}
                {step === 'success' && "Connection Successful!"}
                {step === 'error' && "Connection Failed"}
            </h3>
            <p className="text-sm text-gray-500">
                {step === 'loading' && "Please wait a moment."}
                {step === 'ready' && "Click below to securely open the Plaid window."}
                {step === 'success' && "Your account is linked and will sync shortly."}
                {step === 'error' && (error || "An unknown error occurred.")}
            </p>
        </div>
    </div>
);

export default function ConnectAccountFlow({ isOpen, onClose, onAddSuccess }) {
  const [step, setStep] = useState('loading');
  const [error, setError] = useState(null);
  const [plaidHandler, setPlaidHandler] = useState(null);
  const [isPlaidScriptLoaded, setIsPlaidScriptLoaded] = useState(!!window.Plaid);

  // Use the Plaid Link Token hook
  const { linkToken, isLoading: linkTokenLoading, error: linkTokenError, refetch: refetchLinkToken } = usePlaidLinkToken(isOpen);

  // Effect to load Plaid's script
  useEffect(() => {
    if (window.Plaid) {
      if (!isPlaidScriptLoaded) setIsPlaidScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    script.async = true;
    script.onload = () => setIsPlaidScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Clean up script from document head if it exists
      const scriptElement = document.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]');
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [isPlaidScriptLoaded]);

  // Effect to handle link token loading and errors
  useEffect(() => {
    if (isOpen) {
      setStep('loading');
      setError(null);
    }
  }, [isOpen]);

  // Effect to handle link token errors
  useEffect(() => {
    if (linkTokenError) {
      console.error("Plaid init error:", linkTokenError);
      setError("Could not connect to Plaid. Please try again later.");
      setStep('error');
    }
  }, [linkTokenError]);

  const onSuccess = useCallback(async (public_token, metadata) => {
    setStep('loading');
    try {
      await exchangePublicToken({ public_token, institution: metadata.institution });
      setStep('success');
      onAddSuccess();
    } catch(err) {
      console.error("Error exchanging token:", err);
      setError("Failed to add your account after connection. Please try again.");
      setStep('error');
    }
  }, [onAddSuccess]);

  // Effect to create the Plaid handler once we have the token and script
  useEffect(() => {
    if (!isOpen || !isPlaidScriptLoaded || !linkToken || linkTokenLoading) {
      return;
    }

    const handler = window.Plaid.create({
      token: linkToken,
      onSuccess,
      onExit: (err, metadata) => {
        if (err) {
          console.error("Plaid exit error:", err, metadata);
          setError('The connection process was closed unexpectedly.');
          setStep('error');
        }
      },
    });

    setPlaidHandler(handler);
    setStep('ready');

    return () => {
      if (handler) {
        handler.destroy();
      }
    };
  }, [isPlaidScriptLoaded, linkToken, isOpen, onSuccess, linkTokenLoading]);
  
  const isReady = step === 'ready' && !!plaidHandler;
  
  const handleOpenPlaid = () => {
    if (isReady) {
      plaidHandler.open();
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after a short delay to allow for closing animation
    setTimeout(() => {
        setStep('loading');
        setError(null);
        setPlaidHandler(null);
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={!['loading', 'success'].includes(step) ? handleClose : ()=>{}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-emerald-100 rounded-lg"><Landmark className="w-6 h-6 text-emerald-600" /></div>
            Connect Bank Account
          </DialogTitle>
          <DialogDescription>
            Securely connect your bank using Plaid to automatically track your finances.
          </DialogDescription>
        </DialogHeader>

        <StatusDisplay step={step} error={error} isReady={isReady} />

        <div className="pt-4">
            {step === 'success' ? (
                 <Button onClick={handleClose} className="w-full bg-emerald-600 hover:bg-emerald-700">Done</Button>
            ) : (
                <Button
                    onClick={handleOpenPlaid}
                    disabled={!isReady}
                    className="w-full h-11 text-base bg-emerald-600 hover:bg-emerald-700"
                >
                    {step === 'loading' && <Loader2 className="animate-spin" />}
                    {step !== 'loading' && 'Continue Securely'}
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}