import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAccounts } from '@/hooks/api';
import { useTransactions } from '@/hooks/api';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Edit,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Building,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import AccountDetailsChart from '../components/accounts/AccountDetailsChart';
import RecentTransactionsList from '../components/accounts/RecentTransactionsList';
import EditAccountModal from '../components/accounts/EditAccountModal';

const accountTypeIcons = {
  checking: CreditCard,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  loan: Building,
};

export default function AccountDetailsPage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const location = useLocation();

  const accountId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  }, [location.search]);

  // Use the new hooks
  const { accounts, updateAccount } = useAccounts();
  const { transactions, refetch: refetchTransactions } = useTransactions();

  // Find the specific account and filter transactions
  const account = accounts.find((acc) => acc.id === accountId);
  const accountTransactions = transactions.filter(
    (tx) => tx.account_id === accountId
  );
  const isLoading = !account && accountId; // Show loading if we have an ID but no account found

  const handleUpdateAccount = async (updatedData) => {
    if (!account) return;
    try {
      await updateAccount(account.id, updatedData);
      setShowEditModal(false);
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6 text-center text-common-gray-dark">
        Account not found. Please check the ID or return to the accounts page.
        <Link to={createPageUrl('Accounts')} className="mt-4 inline-block">
          <Button>Back to Accounts</Button>
        </Link>
      </div>
    );
  }

  const IconComponent = accountTypeIcons[account.account_type] || CreditCard;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link
            to={createPageUrl('Accounts')}
            className="flex items-center gap-2 text-common-gray-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Accounts
          </Link>
        </Button>
        <Button onClick={() => setShowEditModal(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Name
        </Button>
      </div>

      <header className="flex items-start gap-4">
        <div className="p-3 bg-common-gray-light rounded-lg">
          <IconComponent className="w-8 h-8 text-common-gray-dark" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-common-gray-dark">
            {account.account_name}
          </h1>
          <p className="text-common-gray-dark">
            {account.institution_name} •••• {account.account_number_last_four}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-common-gray-dark">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-common-gray-dark">
              $
              {account.balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
        {account.available_balance && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-common-gray-dark">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-common-green">
                $
                {account.available_balance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-common-gray-dark">
              Account Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-common-gray-dark capitalize">
              {account.account_type}
            </p>
          </CardContent>
        </Card>
      </div>

      <AccountDetailsChart
        currentBalance={account.balance}
        transactions={accountTransactions}
      />

      <RecentTransactionsList transactions={accountTransactions} />

      <EditAccountModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateAccount}
        account={account}
      />
    </div>
  );
}








