import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccounts } from '@/hooks/api';

export default function CreateManualAccountModal({ isOpen, onClose, onSuccess }) {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Use the new hook
  const { createAccount } = useAccounts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createAccount({
        account_name: accountName,
        account_type: accountType,
        balance: parseFloat(balance) || 0,
        institution_name: institutionName || "Manual Account",
        source: 'manual',
      });
      // Reset form
      setAccountName('');
      setAccountType('');
      setBalance('');
      setInstitutionName('');
      onSuccess();
    } catch (error) {
      console.error("Failed to create manual account:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Manual Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="account-name">Account Name</Label>
              <Input id="account-name" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g., My Wallet, Vacation Savings" required />
            </div>
            <div>
              <Label htmlFor="account-type">Account Type</Label>
              <Select onValueChange={setAccountType} required>
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select an account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="balance">Current Balance</Label>
              <Input id="balance" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <Label htmlFor="institution-name">Institution (Optional)</Label>
              <Input id="institution-name" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} placeholder="e.g., Bank of Sock Drawer" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Create Account'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}