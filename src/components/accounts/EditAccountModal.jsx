import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditAccountModal({ isOpen, onClose, onSave, account }) {
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    if (account) {
      setAccountName(account.account_name || '');
    }
  }, [account]);

  const handleSave = () => {
    onSave({ account_name: accountName });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account Name</DialogTitle>
          <DialogDescription>
            Change the display name for your account. This will not affect the name at your financial institution.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="account-name">Account Name</Label>
          <Input
            id="account-name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter new account name"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}