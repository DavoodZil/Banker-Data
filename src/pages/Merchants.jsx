import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';

export default function MerchantsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-common-gray-dark">Merchants</h1>
          <p className="text-common-gray-dark mt-1">
            View spending by merchant and manage merchant names.
          </p>
        </div>
      </div>
      <Card className="card-shadow border-0 text-center py-24">
        <CardContent className="space-y-4">
          <div className="w-20 h-20 bg-common-blue-secondary rounded-full flex items-center justify-center mx-auto">
            <Store className="w-10 h-10 text-common-blue" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-common-gray-dark mb-2">
              Feature Coming Soon!
            </h3>
            <p className="text-common-gray-dark max-w-md mx-auto">
              This section is under construction. Soon you'll be able to analyze
              your spending by merchant and clean up merchant names.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}








