import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Waves } from 'lucide-react';

export default function CashFlowPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash Flow</h1>
          <p className="text-gray-500 mt-1">Visualize your cash flow to understand your financial health.</p>
        </div>
      </div>
      <Card className="card-shadow border-0 text-center py-24">
        <CardContent className="space-y-4">
          <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto">
            <Waves className="w-10 h-10 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Feature Coming Soon!
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This section is under construction. Soon you'll be able to see a detailed visualization of your income and expenses over time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}