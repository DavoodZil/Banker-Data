import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  Target,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useBankData } from '@/hooks/useBankData';
import AccountOverview from '../components/dashboard/AccountOverview';
import { useCallback, useState } from 'react';

export default function Dashboard() {
  const {
    bankData,
    isLoading,
    refetch,
    dashboardSummary,
    fetchDashboardSummary,
  } = useBankData();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  /**
   * Handles data synchronization
   * @description Refreshes bank data and dashboard summary, updates last sync time
   * @returns {Promise<void>}
   */
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      await refetch();
      if (fetchDashboardSummary) {
        await fetchDashboardSummary();
      }
    } finally {
      setIsSyncing(false);
      setLastSync(new Date());
    }
  }, [refetch, fetchDashboardSummary]);

  const accounts = bankData?.data?.accounts
    ? Object.values(bankData.data.accounts)
    : [];

  const summary = dashboardSummary || {};

  const netWorthFormatted = summary.net_worth?.formatted_amount || '$0';
  const netWorthChangeText = summary.net_worth?.change_text || '0% this month';
  const netWorthTrend = summary.net_worth?.trend || 'neutral';

  const monthlyIncomeFormatted =
    summary.monthly_income?.formatted_amount || '$0';
  const monthlyIncomeStatus = summary.monthly_income?.status || 'On track';
  const monthlyIncomeTrend = summary.monthly_income?.trend || 'neutral';

  const monthlySpendingFormatted =
    summary.monthly_spending?.formatted_amount || '$0';
  const monthlySpendingChangeText =
    summary.monthly_spending?.change_text || '0% vs last month';
  const monthlySpendingTrend = summary.monthly_spending?.trend || 'neutral';

  const totalAccounts = summary.total_accounts?.count || 0;
  const accountsStatusText = summary.total_accounts?.status_text || '0 active';

  const SummaryCardSkeleton = () => (
    <Card className='card-shadow-lg border-0 bg-gradient-to-br from-gray-50 to-slate-50'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='w-8 h-8 rounded-lg' />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className='h-8 w-24 mb-2' />
        <div className='flex items-center gap-1'>
          <Skeleton className='w-4 h-4' />
          <Skeleton className='h-4 w-32' />
        </div>
      </CardContent>
    </Card>
  );

  const transformedAccounts = accounts.map(account => ({
    id: account.id,
    account_name: account.nick_name || account.name,
    account_type: 'checking',
    balance: parseFloat(account.current_balance) || 0,
    currency: 'USD',
    institution_name: account.company_id,
    account_number_last_four: account.id.slice(-4),
    available_balance: parseFloat(account.available_balance_amount) || 0,
    lastSync: account.last_updated,
    is_active: account.status === 1,
  }));

  return (
    <div className='p-6 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-common-gray-dark'>
            Dashboard
          </h1>
          <p className='text-common-gray-dark mt-1'>
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='text-sm text-common-gray-dark'>
            Last sync: {format(lastSync, 'MMM d, h:mm a')}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSync}
            disabled={isSyncing || isLoading}
            className='gap-2'
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing || isLoading ? 'animate-spin' : ''}`}
            />
            {isSyncing || isLoading ? 'Syncing...' : 'Sync'}
          </Button>
          <Link to={createPageUrl('Accounts')}>
            <Button className='bg-common-green hover:bg-common-green-dark gap-2'>
              <Plus className='w-4 h-4' />
              Add Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6'>
        {isLoading ? (
          Array(5)
            .fill(0)
            .map((_, i) => <SummaryCardSkeleton key={i} />)
        ) : (
          <>
            <Card className='card-shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium text-common-gray-dark'>
                    Net Worth
                  </CardTitle>
                  <div className='p-2 bg-common-green-secondary rounded-lg'>
                    <TrendingUp className='w-4 h-4 text-common-green' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-common-gray-dark'>
                  {netWorthFormatted}
                </div>
                <div className='flex items-center gap-1 mt-1'>
                  {netWorthTrend === 'up' ? (
                    <ArrowUpRight className='w-4 h-4 text-common-green' />
                  ) : netWorthTrend === 'down' ? (
                    <ArrowDownRight className='w-4 h-4 text-common-red' />
                  ) : (
                    <span className='w-4 h-4 text-common-gray-dark'>—</span>
                  )}
                  <span
                    className={`text-sm font-medium ${netWorthTrend === 'up' ? 'text-common-green' : netWorthTrend === 'down' ? 'text-common-red' : 'text-common-gray-dark'}`}
                  >
                    {netWorthChangeText}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='card-shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium text-common-gray-dark'>
                    Monthly Income
                  </CardTitle>
                  <div className='p-2 bg-common-blue-secondary rounded-lg'>
                    <DollarSign className='w-4 h-4 text-common-blue' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-common-gray-dark'>
                  {monthlyIncomeFormatted}
                </div>
                <div className='flex items-center gap-1 mt-1'>
                  {monthlyIncomeTrend === 'up' ? (
                    <ArrowUpRight className='w-4 h-4 text-common-blue' />
                  ) : monthlyIncomeTrend === 'down' ? (
                    <ArrowDownRight className='w-4 h-4 text-common-red' />
                  ) : (
                    <span className='w-4 h-4 text-common-gray-dark'>—</span>
                  )}
                  <span
                    className={`text-sm font-medium ${monthlyIncomeTrend === 'up' ? 'text-common-blue' : monthlyIncomeTrend === 'down' ? 'text-common-red' : 'text-common-gray-dark'}`}
                  >
                    {monthlyIncomeStatus}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='card-shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium text-common-gray-dark'>
                    Monthly Spending
                  </CardTitle>
                  <div className='p-2 bg-common-orange-secondary rounded-lg'>
                    <CreditCard className='w-4 h-4 text-common-orange' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-common-gray-dark'>
                  {monthlySpendingFormatted}
                </div>
                <div className='flex items-center gap-1 mt-1'>
                  {monthlySpendingTrend === 'up' ? (
                    <ArrowUpRight className='w-4 h-4 text-common-red' />
                  ) : monthlySpendingTrend === 'down' ? (
                    <ArrowDownRight className='w-4 h-4 text-common-orange' />
                  ) : (
                    <span className='w-4 h-4 text-common-gray-dark'>—</span>
                  )}
                  <span
                    className={`text-sm font-medium ${monthlySpendingTrend === 'up' ? 'text-common-red' : monthlySpendingTrend === 'down' ? 'text-common-orange' : 'text-common-gray-dark'}`}
                  >
                    {monthlySpendingChangeText}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='card-shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium text-common-gray-dark'>
                    Budget Used
                  </CardTitle>
                  <div className='p-2 bg-purple-100 rounded-lg'>
                    <Target className='w-4 h-4 text-purple-600' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-common-gray-dark'>
                  —
                </div>
                <div className='flex items-center gap-1 mt-1'>
                  <Target className='w-4 h-4 text-purple-500' />
                  <span className='text-sm font-medium text-purple-600'>
                    Budget data coming soon
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className='card-shadow-lg border-0 bg-gradient-to-br from-gray-50 to-slate-50'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-medium text-common-gray-dark'>
                    Total Accounts
                  </CardTitle>
                  <div className='p-2 bg-common-gray-light rounded-lg'>
                    <PiggyBank className='w-4 h-4 text-common-gray-dark' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-common-gray-dark'>
                  {totalAccounts}
                </div>
                <div className='flex items-center gap-1 mt-1'>
                  <Badge variant='secondary' className='text-xs'>
                    {accountsStatusText}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Accounts Section */}
      <AccountOverview accounts={transformedAccounts} isLoading={isLoading} />

      {/* Coming Soon Section */}
      <div className='flex flex-col items-center justify-center py-24'>
        <div className='text-3xl font-bold text-common-gray-dark mb-2'>
          Coming Soon
        </div>
        <div className='text-lg text-common-gray-dark'>
          Detailed analytics and charts will be available here soon.
        </div>
      </div>
    </div>
  );
}
