
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function NetWorthChart({ accounts, transactions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="card-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Net Worth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Generate net worth data for the last 6 months
  const generateNetWorthData = () => {
    const currentDate = new Date();
    const currentNetWorth = accounts.reduce((sum, account) => {
      if (account.account_type === 'credit' || account.account_type === 'loan') {
        return sum - Math.abs(account.balance);
      }
      return sum + account.balance;
    }, 0);

    // Generate historical data (mock data for demonstration)
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const date = startOfMonth(subMonths(currentDate, i));
      
      // Mock historical net worth with some realistic variation
      let netWorth;
      if (i === 0) {
        netWorth = currentNetWorth;
      } else {
        // Simulate growth/decline over time
        const baseGrowth = 0.02; // 2% monthly growth
        const randomVariation = (Math.random() - 0.5) * 0.04; // ±2% random variation
        const monthlyChange = baseGrowth + randomVariation;
        netWorth = currentNetWorth / Math.pow(1 + monthlyChange, i);
      }

      data.push({
        date: format(date, 'MMM yyyy'),
        netWorth: Math.round(netWorth),
        assets: Math.round(netWorth * 1.3), // Mock assets value
        liabilities: Math.round(netWorth * 0.3) // Mock liabilities value
      });
    }

    return data;
  };

  const chartData = generateNetWorthData();
  
  // Calculate trend
  const currentValue = chartData[chartData.length - 1]?.netWorth || 0;
  const previousValue = chartData[chartData.length - 2]?.netWorth || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <Card className="card-shadow border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            Net Worth Trend
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${currentValue.toLocaleString()}
            </div>
            <div className={`text-sm font-medium flex items-center gap-1 ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {isPositive ? '↗' : '↘'} {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name) => [
                `$${value.toLocaleString()}`, 
                name === 'netWorth' ? 'Net Worth' : 
                name === 'assets' ? 'Assets' : 'Liabilities'
              ]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#10b981" 
              strokeWidth={3}
              fill="url(#netWorthGradient)"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm text-gray-500">Assets</div>
            <div className="text-lg font-semibold text-gray-900">
              ${chartData[chartData.length - 1]?.assets.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Liabilities</div>
            <div className="text-lg font-semibold text-red-600">
              ${chartData[chartData.length - 1]?.liabilities.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">6-Month Change</div>
            <div className={`text-lg font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}${change.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
