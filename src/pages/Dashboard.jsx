
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
import AccountOverview from "../components/dashboard/AccountOverview";

export default function Dashboard() {
  const { bankData, isLoading, error, refetch } = useBankData();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState(new Date());

  // Extract data safely
  const accounts = bankData?.data?.accounts ? Object.values(bankData.data.accounts) : [];
  const transactions = bankData?.data?.transactions || [];
  const categories = bankData?.data?.categories || [];

  // Metrics calculations (same as before)
  const calculateNetWorth = () => {
    return accounts.reduce((sum, account) => {
      if (account.account_type === 'credit' || account.account_type === 'loan') {
        return sum - Math.abs(account.balance);
      }
      return sum + account.balance;
    }, 0);
  };

  const calculateMonthlySpending = () => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart &&
               transactionDate <= monthEnd &&
               t.amount < 0;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const calculateMonthlyIncome = () => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart &&
               transactionDate <= monthEnd &&
               t.amount > 0;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateTotalBudget = () => {
    return categories
      .filter(cat => cat.budget_amount)
      .reduce((sum, cat) => sum + cat.budget_amount, 0);
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
                {accounts.filter(a => a.is_active).length} active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Section */}
      <AccountOverview accounts={accounts} isLoading={isLoading} />

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-3xl font-bold text-gray-400 mb-2">Coming Soon</div>
        <div className="text-lg text-gray-500">Detailed analytics and charts will be available here soon.</div>
      </div>
    </div>
  );
}
