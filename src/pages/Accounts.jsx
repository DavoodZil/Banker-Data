import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  Plus,
  Building,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useBankData } from '@/hooks/useBankData';
import { createPageUrl } from '@/utils';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import ConnectAccountFlow from '../components/accounts/ConnectAccountFlow';
import CreateManualAccountModal from '../components/accounts/CreateManualAccountModal';
import AccountCard from '../components/accounts/AccountCard';

export default function Accounts() {
  const [showConnectFlow, setShowConnectFlow] = useState(false);
  const [showManualAccountModal, setShowManualAccountModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    bankData,
    isLoading,
    error,
    refetch: refetchBankData,
  } = useBankData();
  const { toast } = useToast();

  const accounts = bankData?.data?.accounts
    ? Object.values(bankData.data.accounts)
    : [];


  /**
   * Loads and refreshes account data from the API
   * @description Fetches the latest account data and updates the component state
   * @returns {Promise<void>}
   */
  const loadAccounts = async () => {
    try {
      // Refetch bank data
      await refetchBankData();
    } catch (error) {}
  };

  /**
   * Handles synchronization of transactions with the bank
   * @description Initiates a sync process to fetch latest transactions from connected accounts
   * @returns {Promise<void>}
   */
  const handleSyncTransactions = async () => {
    setIsSyncing(true);
    try {
      const response = await syncTransactions();
      if (response.data && response.data.success) {
        loadAccounts();
      } else {
        const errorMessage =
          response.data?.message ||
          response.data?.error ||
          'Unknown error during sync';
        toast({
          title: 'Sync Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        error.message ||
        'An unexpected error occurred.';
      toast({
        title: 'Sync Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Toggles the visibility of account balances
   * @description Switches between showing and hiding account balance information
   * @returns {void}
   */
  const handleToggleBalances = useCallback(() => {
    setShowBalances((prev) => !prev);
  }, []);

  /**
   * Opens the delete all accounts confirmation dialog
   * @description Shows a confirmation dialog for deleting all connected accounts
   * @returns {void}
   */
  const handleDeleteAll = useCallback(() => {
    setShowDeleteAllDialog(true);
  }, []);

  /**
   * Opens the add account modal
   * @description Shows the modal for adding new accounts (Plaid or manual)
   * @returns {void}
   */
  const handleAddAccount = useCallback(() => {
    setShowAddAccountModal(true);
  }, []);

  /**
   * Opens the Plaid connection flow
   * @description Closes the add account modal and opens the Plaid bank connection flow
   * @returns {void}
   */
  const handleConnectFlow = useCallback(() => {
    setShowAddAccountModal(false);
    setShowConnectFlow(true);
  }, []);

  /**
   * Opens the manual account creation modal
   * @description Closes the add account modal and opens the manual account creation form
   * @returns {void}
   */
  const handleManualAccount = useCallback(() => {
    setShowAddAccountModal(false);
    setShowManualAccountModal(true);
  }, []);

  /**
   * Removes all connected accounts
   * @description Deletes all connected bank accounts after confirmation
   * @returns {Promise<void>}
   */
  const handleRemoveAll = async () => {
    setIsDeletingAll(true);
    try {
      await removeAllAccounts();
      setDeleteConfirmationText('');
      setShowDeleteAllDialog(false);
      loadAccounts();
    } catch (error) {
    } finally {
      setIsDeletingAll(false);
    }
  };

  /**
   * Verifies the Plaid integration status
   * @description Checks the health and status of the Plaid bank integration
   * @returns {Promise<void>}
   */
  const handleVerifyIntegration = async () => {
    setIsVerifying(true);
    try {
      const response = await verifyPlaidIntegration();

      const { summary, overall_status } = response.data;
      const statusMessages = {
        healthy: '✅ All integrations working correctly!',
        warnings: `⚠️ Integration working with ${summary.warnings} warnings`,
        issues_detected: `❌ Found ${summary.failed} issues that need attention`,
      };

      toast({
        title: 'Verification Complete',
        description: statusMessages[overall_status] || 'Verification completed',
        variant: overall_status === 'success' ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Verification Failed',
        description: 'Failed to verify integration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handles successful manual account creation
   * @description Closes the manual account modal and refreshes account data
   * @returns {void}
   */
  const handleManualAccountSuccess = () => {
    setShowManualAccountModal(false);
    loadAccounts();
  };

  /**
   * Calculates the total balance for a specific account type
   * @description Sums up the balances of all accounts of a given type
   * @param {string} type - The account type (checking, savings, credit, etc.)
   * @returns {number} The total balance for the specified account type
   */
  const calculateTotalByType = (type) => {
    return accounts
      .filter((account) => (account.account_type || account.type) === type)
      .reduce((sum, account) => sum + (account.balance || 0), 0);
  };

  const accountsByType = {
    checking: accounts.filter((a) => (a.type || a.account_type) === 'checking'),
    savings: accounts.filter((a) => (a.type || a.account_type) === 'savings'),
    credit: accounts.filter((a) => (a.type || a.account_type) === 'credit'),
    investment: accounts.filter(
      (a) => (a.type || a.account_type) === 'investment'
    ),
    loan: accounts.filter((a) => (a.type || a.account_type) === 'loan'),
    cash: accounts.filter((a) => (a.type || a.account_type) === 'cash'),
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-common-gray-dark">Accounts</h1>
          <p className="text-sm text-common-gray-dark mt-1">
            {accounts.length} connected accounts • Manage your financial
            connections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refetchBankData}
            disabled={isLoading}
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            {isLoading ? 'Loading...' : 'Bank Data'}
          </Button>
          <Button
            variant="outline"
            onClick={handleVerifyIntegration}
            disabled={isVerifying}
            size="sm"
            className="gap-2 text-xs"
          >
            <CheckCircle
              className={`w-4 h-4 ${isVerifying ? 'animate-pulse' : ''}`}
            />
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleBalances}
            size="sm"
            className="gap-2 text-xs"
          >
            {showBalances ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showBalances ? 'Hide' : 'Show'}
          </Button>
          <Button
            variant="outline"
            onClick={handleSyncTransactions}
            disabled={accounts.length === 0 || isLoading || isSyncing}
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={accounts.length === 0 || isLoading}
            size="sm"
            className="gap-2 text-xs"
          >
            <Trash2 className="w-4 h-4" />
            Remove All
          </Button>
          <Button
            onClick={handleAddAccount}
            size="sm"
            className="bg-common-green hover:bg-common-green-dark gap-2 px-4"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        </div>
      </div>

      {accounts.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-common-gray-light pb-2">
              <div className="p-1.5 rounded-lg bg-common-blue-secondary">
                <CreditCard className="w-4 h-4 text-common-blue" />
              </div>
              <h2 className="text-lg font-semibold text-common-gray-dark">
                Connected Accounts
              </h2>
              <span className="text-sm text-common-gray-dark">({accounts.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <Link
                  to={createPageUrl(`AccountDetails?id=${account.id}`)}
                  key={account.id}
                  className="no-underline"
                >
                  <div className="bg-white rounded-lg border border-common-gray-light p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-common-gray-dark" />
                        <span className="text-sm font-medium text-common-gray-dark">
                          Account
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          account.status === 0
                            ? 'bg-common-green-secondary text-common-green-secondary-foreground'
                            : 'bg-common-red-secondary text-common-red-secondary-foreground'
                        }`}
                      >
                        {account.status === 0 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-common-gray-dark mb-2 text-sm leading-tight">
                      {account.name}
                    </h3>
                    <p className="text-xs text-common-gray-dark">ID: {account.id}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <Card className="bg-white card-shadow border-0 text-center py-16">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-common-blue-secondary rounded-full flex items-center justify-center mx-auto">
              <RefreshCw className="w-10 h-10 text-common-blue-light animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-common-gray-dark mb-2">
                Loading accounts...
              </h3>
              <p className="text-common-gray-dark">
                Please wait while we fetch your account information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 && !isLoading && (
        <Card className="bg-white card-shadow border-0 text-center py-16">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-common-green-secondary rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-10 h-10 text-common-green-light" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-common-gray-dark mb-2">
                No accounts connected
              </h3>
              <p className="text-common-gray-dark mb-6 max-w-sm mx-auto">
                Get started by linking a bank or adding a manual account to see
                your finances in one place.
              </p>
              <Button
                onClick={handleAddAccount}
                className="bg-common-green hover:bg-common-green-dark text-base py-3 px-6 rounded-lg"
              >
                Add Your First Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Account Modal */}
      <Dialog open={showAddAccountModal} onOpenChange={setShowAddAccountModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add an Account</DialogTitle>
            <DialogDescription>
              Choose how you want to add an account to track your finances.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={handleConnectFlow}
            >
              <Building className="w-6 h-6 text-common-green" />
              <span className="font-semibold">Link Bank via Plaid</span>
              <span className="text-xs text-common-gray-dark">Automatic Sync</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={handleManualAccount}
            >
              <Plus className="w-6 h-6 text-common-blue" />
              <span className="font-semibold">Create Manual Account</span>
              <span className="text-xs text-common-gray-dark">Cash, Assets, etc.</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConnectAccountFlow
        isOpen={showConnectFlow}
        onClose={() => setShowConnectFlow(false)}
        onAddSuccess={() => {
          setShowConnectFlow(false);
          loadAccounts();
        }}
      />

      <CreateManualAccountModal
        isOpen={showManualAccountModal}
        onClose={() => setShowManualAccountModal(false)}
        onSuccess={handleManualAccountSuccess}
      />

      <AlertDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-common-red" />
              Remove All Accounts
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you absolutely sure? This action cannot be undone. This will
                permanently disconnect all of your linked accounts and delete
                all associated transaction history.
              </p>
              <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                <strong>Warning:</strong> All financial data, including every
                transaction from every account, will be permanently deleted from
                this application.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="delete-confirm">
              To confirm, please type "DELETE" below:
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              autoComplete="off"
              disabled={isDeletingAll}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAll}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAll}
              disabled={deleteConfirmationText !== 'DELETE' || isDeletingAll}
              className="bg-common-red hover:bg-common-red-dark"
            >
              {isDeletingAll ? 'Deleting...' : 'Yes, delete everything'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}








