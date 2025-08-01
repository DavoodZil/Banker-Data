
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building, CreditCard, PiggyBank, TrendingUp, Eye, EyeOff, Trash2, AlertTriangle, RefreshCw, CheckCircle, Wallet } from "lucide-react";
import { useBankData } from "@/hooks/useBankData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import ConnectAccountFlow from "../components/accounts/ConnectAccountFlow";
import CreateManualAccountModal from "../components/accounts/CreateManualAccountModal";
import AccountCard from "../components/accounts/AccountCard";
// TODO: Implement these functions in the new API structure
// import { removeAllAccounts } from "@/api/functions";
// import { syncTransactions } from "@/api/functions";
// import { verifyPlaidIntegration } from "@/api/functions";

export default function Accounts() {
  const [showConnectFlow, setShowConnectFlow] = useState(false);
  const [showManualAccountModal, setShowManualAccountModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Use bank data hook only
  const { bankData, isLoading, error, refetch: refetchBankData } = useBankData();

  // Extract accounts from bank data structure
  const accounts = bankData?.data?.accounts ? Object.values(bankData.data.accounts) : [];
  
  // Debug log to see account structure
  useEffect(() => {
    if (accounts.length > 0) {
      console.log('Accounts from /bank-data:', accounts);
    }
  }, [accounts]);

  // Set accounts when bank data is available
  useEffect(() => {
    if (error) {
      console.error('Bank Data Error in Accounts component:', error);
    }
  }, [error]);

  const loadAccounts = async () => {
    try {
      // Refetch bank data
      await refetchBankData();
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleSyncTransactions = async () => {
    setIsSyncing(true);
    try {
      const response = await syncTransactions();
      if (response.data && response.data.success) {
        console.log(response.data.message || "Transactions synced successfully!");
        loadAccounts();
      } else {
        const errorMessage = response.data?.message || response.data?.error || "Unknown error during sync";
        alert(`Sync Failed: ${errorMessage}`);
      }
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.error || error.message || "An unexpected error occurred.";
      alert(`Sync Failed: ${errorMessage}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveAll = async () => {
    setIsDeletingAll(true);
    try {
      await removeAllAccounts();
      setDeleteConfirmationText("");
      setShowDeleteAllDialog(false);
      loadAccounts();
    } catch (error) {
      console.error("Failed to remove all accounts:", error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleVerifyIntegration = async () => {
    setIsVerifying(true);
    try {
      const response = await verifyPlaidIntegration();
      console.log('Verification Results:', response.data);
      
      const { summary, overall_status } = response.data;
      const statusMessages = {
        healthy: "✅ All integrations working correctly!",
        warnings: `⚠️ Integration working with ${summary.warnings} warnings`,
        issues_detected: `❌ Found ${summary.failed} issues that need attention`
      };
      
      alert(statusMessages[overall_status] || "Verification completed");
      
    } catch (error) {
      console.error('Verification failed:', error);
      alert("Failed to verify integration. Check console for details.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualAccountSuccess = () => {
    setShowManualAccountModal(false);
    loadAccounts();
  }

  const calculateTotalByType = (type) => {
    return accounts
      .filter(account => (account.account_type || account.type) === type)
      .reduce((sum, account) => sum + (account.balance || 0), 0);
  };

  const accountsByType = {
    checking: accounts.filter(a => (a.type || a.account_type) === 'checking'),
    savings: accounts.filter(a => (a.type || a.account_type) === 'savings'),
    credit: accounts.filter(a => (a.type || a.account_type) === 'credit'),
    investment: accounts.filter(a => (a.type || a.account_type) === 'investment'),
    loan: accounts.filter(a => (a.type || a.account_type) === 'loan'),
    cash: accounts.filter(a => (a.type || a.account_type) === 'cash')
  };

  const typeConfig = {
    checking: { icon: CreditCard, label: 'Checking', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    savings: { icon: PiggyBank, label: 'Savings', color: 'text-green-600', bgColor: 'bg-green-100' },
    credit: { icon: CreditCard, label: 'Credit Cards', color: 'text-red-600', bgColor: 'bg-red-100' },
    investment: { icon: TrendingUp, label: 'Investments', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    loan: { icon: Building, label: 'Loans', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    cash: { icon: Wallet, label: 'Cash', color: 'text-gray-600', bgColor: 'bg-gray-100' }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {accounts.length} connected accounts • Manage your financial connections
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
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Bank Data'}
          </Button>
          <Button
            variant="outline"
            onClick={handleVerifyIntegration}
            disabled={isVerifying}
            size="sm"
            className="gap-2 text-xs"
          >
            <CheckCircle className={`w-4 h-4 ${isVerifying ? 'animate-pulse' : ''}`} />
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowBalances(!showBalances)}
            size="sm"
            className="gap-2 text-xs"
          >
            {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showBalances ? 'Hide' : 'Show'}
          </Button>
          <Button
            variant="outline"
            onClick={handleSyncTransactions}
            disabled={accounts.length === 0 || isLoading || isSyncing}
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteAllDialog(true)}
            disabled={accounts.length === 0 || isLoading}
            size="sm"
            className="gap-2 text-xs"
          >
            <Trash2 className="w-4 h-4" />
            Remove All
          </Button>
          <Button
            onClick={() => setShowAddAccountModal(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-4"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        </div>
      </div>

      {accounts.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <div className="p-1.5 rounded-lg bg-blue-100">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Connected Accounts
              </h2>
              <span className="text-sm text-gray-500">
                ({accounts.length})
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <Link to={createPageUrl(`AccountDetails?id=${account.id}`)} key={account.id} className="no-underline">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Account</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        account.status === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {account.status === 0 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {account.name}
                    </h3>
                    <p className="text-xs text-gray-500">ID: {account.id}</p>
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
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw className="w-10 h-10 text-blue-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading accounts...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch your account information.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {accounts.length === 0 && !isLoading && (
        <Card className="bg-white card-shadow border-0 text-center py-16">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No accounts connected
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Get started by linking a bank or adding a manual account to see your finances in one place.
              </p>
              <Button
                onClick={() => setShowAddAccountModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-base py-3 px-6 rounded-lg"
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
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => {setShowAddAccountModal(false); setShowConnectFlow(true)}}>
                    <Building className="w-6 h-6 text-emerald-600"/>
                    <span className="font-semibold">Link Bank via Plaid</span>
                    <span className="text-xs text-gray-500">Automatic Sync</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => {setShowAddAccountModal(false); setShowManualAccountModal(true)}}>
                    <Plus className="w-6 h-6 text-blue-600"/>
                    <span className="font-semibold">Create Manual Account</span>
                    <span className="text-xs text-gray-500">Cash, Assets, etc.</span>
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
      
      <AlertDialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Remove All Accounts
            </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you absolutely sure? This action cannot be undone. This will permanently disconnect all of your linked accounts and delete all associated transaction history.
            </p>
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              <strong>Warning:</strong> All financial data, including every transaction from every account, will be permanently deleted from this application.
            </p>
          </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="delete-confirm">To confirm, please type "DELETE" below:</Label>
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
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingAll ? 'Deleting...' : 'Yes, delete everything'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
