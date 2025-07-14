
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard } from "lucide-react";

export default function SpendingChart({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="card-shadow border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-600" />
            Daily Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const generateChartData = () => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 13 - i));
      const dayTransactions = transactions.filter(t => {
        const transactionDate = startOfDay(new Date(t.date));
        return transactionDate.getTime() === date.getTime();
      });
      
      const spending = dayTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const income = dayTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        date: format(date, 'MMM d'),
        fullDate: format(date, 'yyyy-MM-dd'),
        spending: Math.round(spending),
        income: Math.round(income),
        net: Math.round(income - spending)
      };
    });
    
    return days;
  };

  const chartData = generateChartData();
  const totalSpending = chartData.reduce((sum, day) => sum + day.spending, 0);
  const avgDaily = totalSpending / chartData.length;

  return (
    <Card className="card-shadow border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-orange-600" />
            Daily Spending
          </CardTitle>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${avgDaily.toFixed(0)}/day avg
            </div>
            <div className="text-sm text-gray-500">
              Last 14 days
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name) => [
                `$${value.toLocaleString()}`, 
                name === 'spending' ? 'Spending' : 
                name === 'income' ? 'Income' : 'Net'
              ]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar 
              dataKey="spending" 
              fill="#f97316" 
              radius={[4, 4, 0, 0]}
              name="spending"
            />
            <Bar 
              dataKey="income" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="income"
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm text-gray-500">Total Spent</div>
            <div className="text-lg font-semibold text-orange-600">
              ${totalSpending.toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Highest Day</div>
            <div className="text-lg font-semibold text-gray-900">
              ${Math.max(...chartData.map(d => d.spending)).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Days with Spending</div>
            <div className="text-lg font-semibold text-gray-900">
              {chartData.filter(d => d.spending > 0).length}/14
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
