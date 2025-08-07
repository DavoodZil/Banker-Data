
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useBankData } from "@/hooks/useBankData";
import AccountOverview from "../components/dashboard/AccountOverview";

export default function Dashboard() {
  const { bankData, isLoading, error, refetch, dashboardSummary, fetchDashboardSummary } = useBankData();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState(new Date());

  // Extract data safely with the correct structure
  const accounts = bankData?.data?.accounts ? Object.values(bankData.data.accounts) : [];

  // Use dashboard summary data from API
  const summary = dashboardSummary || {};
  
  // Extract values from API response with fallbacks
  const netWorth = summary.net_worth?.amount || 0;
  const netWorthFormatted = summary.net_worth?.formatted_amount || '$0';
  const netWorthChangeText = summary.net_worth?.change_text || '0% this month';
  const netWorthTrend = summary.net_worth?.trend || 'neutral';
  
  const monthlyIncome = summary.monthly_income?.amount || '0.00';
  const monthlyIncomeFormatted = summary.monthly_income?.formatted_amount || '$0';
  const monthlyIncomeStatus = summary.monthly_income?.status || 'On track';
  const monthlyIncomeTrend = summary.monthly_income?.trend || 'neutral';
  
  const monthlySpending = summary.monthly_spending?.amount || '0.00';
  const monthlySpendingFormatted = summary.monthly_spending?.formatted_amount || '$0';
  const monthlySpendingChangeText = summary.monthly_spending?.change_text || '0% vs last month';
  const monthlySpendingTrend = summary.monthly_spending?.trend || 'neutral';
  
  const totalAccounts = summary.total_accounts?.count || 0;
  const activeAccounts = summary.total_accounts?.active_count || 0;
  const accountsStatusText = summary.total_accounts?.status_text || '0 active';

  // Skeleton component for summary cards
  const SummaryCardSkeleton = () => (
    <Card className="card-shadow-lg border-0 bg-gradient-to-br from-gray-50 to-slate-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-2" />
        <div className="flex items-center gap-1">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );

  // Transform accounts to match expected format for AccountOverview
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
    is_active: account.status === 1 
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last sync: {format(lastSync, 'MMM d, h:mm a')}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
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
            }}
            disabled={isSyncing || isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing || isLoading ? 'animate-spin' : ''}`} />
            {isSyncing || isLoading ? 'Syncing...' : 'Sync'}
          </Button>
          <Link to={createPageUrl("Accounts")}> 
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <Plus className="w-4 h-4" />
              Add Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {isLoading ? (
          // Show skeleton loaders when loading
          Array(5).fill(0).map((_, i) => <SummaryCardSkeleton key={i} />)
        ) : (
          // Show actual cards when data is loaded
          <>
            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Net Worth
                  </CardTitle>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {netWorthFormatted}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {netWorthTrend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : netWorthTrend === 'down' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <span className="w-4 h-4 text-gray-400">—</span>
                  )}
                  <span className={`text-sm font-medium ${netWorthTrend === 'up' ? 'text-emerald-600' : netWorthTrend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {netWorthChangeText}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Income
                  </CardTitle>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {monthlyIncomeFormatted}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {monthlyIncomeTrend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-blue-500" />
                  ) : monthlyIncomeTrend === 'down' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : (
                    <span className="w-4 h-4 text-gray-400">—</span>
                  )}
                  <span className={`text-sm font-medium ${monthlyIncomeTrend === 'up' ? 'text-blue-600' : monthlyIncomeTrend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {monthlyIncomeStatus}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Spending
                  </CardTitle>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {monthlySpendingFormatted}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {monthlySpendingTrend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                  ) : monthlySpendingTrend === 'down' ? (
                    <ArrowDownRight className="w-4 h-4 text-orange-500" />
                  ) : (
                    <span className="w-4 h-4 text-gray-400">—</span>
                  )}
                  <span className={`text-sm font-medium ${monthlySpendingTrend === 'up' ? 'text-red-600' : monthlySpendingTrend === 'down' ? 'text-orange-600' : 'text-gray-600'}`}>
                    {monthlySpendingChangeText}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Budget Used
                  </CardTitle>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  —
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-600">
                    Budget data coming soon
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-gray-50 to-slate-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Accounts
                  </CardTitle>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <PiggyBank className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {totalAccounts}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
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
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-3xl font-bold text-gray-400 mb-2">Coming Soon</div>
        <div className="text-lg text-gray-500">Detailed analytics and charts will be available here soon.</div>
      </div>
    </div>
  );
}
