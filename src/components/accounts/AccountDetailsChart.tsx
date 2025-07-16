import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { TransactionResponse } from '@/types/api.types';

interface AccountDetailsChartProps {
  currentBalance: number;
  transactions: TransactionResponse[];
}

const calculateBalanceHistory = (currentBalance: number, transactions: TransactionResponse[], days: number) => {
  const endDate = startOfDay(new Date());
  const startDate = startOfDay(subDays(endDate, days));
  const dateInterval = eachDayOfInterval({ start: startDate, end: endDate });

  const balanceData = new Map(
    dateInterval.map(date => [format(date, 'yyyy-MM-dd'), { date: format(date, 'MMM dd'), balance: null }])
  );
  
  balanceData.set(format(endDate, 'yyyy-MM-dd'), { date: format(endDate, 'MMM dd'), balance: currentBalance });

  let runningBalance = currentBalance;
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const tx of sortedTransactions) {
    const txDate = startOfDay(new Date(tx.date));
    if (txDate < startDate) break; 
    
    const dateKey = format(txDate, 'yyyy-MM-dd');
    if (balanceData.has(dateKey)) {
      if (balanceData.get(dateKey).balance === null) {
        balanceData.get(dateKey).balance = runningBalance;
      }
    }
    runningBalance -= tx.amount;
  }
  
  let lastKnownBalance = runningBalance;
  const finalChartData = Array.from(balanceData.values()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for(let i = finalChartData.length - 1; i >= 0; i--) {
      if(finalChartData[i].balance !== null) {
          lastKnownBalance = finalChartData[i].balance;
      } else {
          finalChartData[i].balance = lastKnownBalance;
      }
  }

  return finalChartData;
};

export default function AccountDetailsChart({ currentBalance, transactions }: AccountDetailsChartProps) {
  const [timeRange, setTimeRange] = useState(30); // Default to 30 days

  const chartData = useMemo(() => {
    return calculateBalanceHistory(currentBalance, transactions, timeRange);
  }, [currentBalance, transactions, timeRange]);

  const timeRanges = [
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
    { label: '1Y', days: 365 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Balance History</CardTitle>
        <div className="flex gap-1">
          {timeRanges.map(({ label, days }) => (
            <Button
              key={days}
              variant={timeRange === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(days)}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 'Balance']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fill="url(#balanceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}