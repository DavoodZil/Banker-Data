
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertTriangle
} from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useBankData } from "@/hooks/useBankData";
import { AccountResponse } from "@/types/api.types";
import AccountOverview from "../components/dashboard/AccountOverview";

export default function Dashboard() {
  const { bankData, isLoading, error, refetch } = useBankData();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState(new Date());

  // Extract data safely with the correct structure
  const accounts = bankData?.data?.accounts ? Object.values(bankData.data.accounts as Record<string, AccountResponse>) : [];
  const categories = bankData?.data?.categories || {};
  const providerAccounts = bankData?.data?.providerAccounts || [];

  // Metrics calculations updated for new structure
  const calculateNetWorth = () => {
    return accounts.reduce((sum, account) => {
      const balance = parseFloat((account as any).current_balance?.toString() || '0') || 0;
      // Assuming credit/loan accounts have negative balances
      return sum + balance;
    }, 0);
  };

  const calculateMonthlySpending = () => {
    // Since transactions are not in this response, we'll use a mock calculation
    // In a real implementation, you'd need to fetch transactions separately
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    
    // Mock calculation based on account balances (this is just for demo)
    const totalBalance = accounts.reduce((sum, account) => {
      return sum + (parseFloat((account as any).current_balance?.toString() || '0') || 0);
    }, 0);
    
    // Mock monthly spending as 20% of total balance
    return Math.abs(totalBalance * 0.2);
  };

  const calculateMonthlyIncome = () => {
    // Mock calculation since transactions are not available
    const totalBalance = accounts.reduce((sum, account) => {
      return sum + (parseFloat((account as any).current_balance?.toString() || '0') || 0);
    }, 0);
    
    // Mock monthly income as 30% of total balance
    return totalBalance * 0.3;
  };

  const calculateTotalBudget = () => {
    // Since categories don't have budget amounts in this structure,
    // we'll use a mock calculation
    const totalBalance = accounts.reduce((sum, account) => {
      return sum + (parseFloat((account as any).current_balance?.toString() || '0') || 0);
    }, 0);
    
    // Mock budget as 50% of total balance
    return totalBalance * 0.5;
  };

  const calculateBudgetUtilization = () => {
    const totalBudget = calculateTotalBudget();
    const monthlySpending = calculateMonthlySpending();
    return totalBudget > 0 ? (monthlySpending / totalBudget) * 100 : 0;
  };

  const netWorth = calculateNetWorth();
  const monthlySpending = calculateMonthlySpending();
  const monthlyIncome = calculateMonthlyIncome();
  const totalBudget = calculateTotalBudget();
  const budgetUtilization = calculateBudgetUtilization();

  const getNetWorthTrend = () => {
    const currentNetWorth = netWorth;
    const lastMonthNetWorth = currentNetWorth * 0.97; // Mock 3% growth
    const change = currentNetWorth - lastMonthNetWorth;
    const changePercent = lastMonthNetWorth > 0 ? (change / lastMonthNetWorth) * 100 : 0;
    return {
      change,
      changePercent,
      isPositive: change >= 0
    };
  };

  const netWorthTrend = getNetWorthTrend();

  // Transform accounts to match expected format for AccountOverview
  const transformedAccounts = accounts.map((account: any) => ({
    id: account.id,
    account_name: account.nick_name || account.name,
    account_type: 'checking', 
    balance: parseFloat(account.current_balance?.toString() || '0') || 0,
    currency: 'USD', 
    institution_name: account.company_id, 
    account_number_last_four: account.id?.toString().slice(-4) || '0000',
    available_balance: parseFloat(account.available_balance_amount?.toString() || '0') || 0,
    lastSync: account.last_updated,
    is_active: account.status === '1' || account.status === 1 
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
            onClick={refetch}
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
              ${netWorth.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {netWorthTrend.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${netWorthTrend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {netWorthTrend.isPositive ? '+' : ''}{netWorthTrend.changePercent.toFixed(1)}% this month
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
              ${monthlyIncome.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">
                On track
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
              ${monthlySpending.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-medium">
                -5% vs last month
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
              {budgetUtilization.toFixed(0)}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              {budgetUtilization > 90 ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <Target className="w-4 h-4 text-purple-500" />
              )}
              <span className={`text-sm font-medium ${budgetUtilization > 90 ? 'text-red-600' : 'text-purple-600'}`}>
                of ${totalBudget.toLocaleString()} budget
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
              {accounts.length}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                {accounts.filter(a => a.status === 1).length} active
              </Badge>
            </div>
          </CardContent>
        </Card>
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
