import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, PiggyBank, TrendingUp, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const accountTypeIcons = {
  checking: CreditCard,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  loan: Building,
};

const accountTypeColors = {
  checking: 'bg-common-blue-secondary text-common-blue-dark',
  savings: 'bg-common-green-secondary text-common-green-dark',
  credit: 'bg-common-red-secondary text-common-red-dark',
  investment: 'bg-common-violet-secondary text-common-violet-dark',
  loan: 'bg-common-orange-secondary text-common-orange-dark',
};

export default function AccountOverview({ accounts, isLoading }) {
  if (isLoading) {
    return (
      <Card className='card-shadow border-0'>
        <CardHeader className='pb-4'>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <Skeleton className='w-10 h-10 rounded-lg' />
                    <div>
                      <Skeleton className='h-4 w-32 mb-1' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </div>
                  <div className='text-right'>
                    <Skeleton className='h-5 w-20 mb-1' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='card-shadow border-0'>
      <CardHeader className='pb-4'>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {accounts.map(account => {
            const Icon = accountTypeIcons[account.account_type];

            return (
              <div
                key={account.id}
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-common-gray-light transition-smooth bg-white'
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`p-2 rounded-lg ${accountTypeColors[account.account_type]}`}
                  >
                    <Icon className='w-5 h-5' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='font-medium text-common-gray-dark truncate'>
                      {account.account_name.split(' ')[2]}
                    </div>
                    <div className='text-sm text-common-gray-dark truncate'>
                      {account.institution_name} ••••{' '}
                      {account.account_name.split(' ')[1].slice(-5)}
                    </div>
                  </div>
                </div>
                <div className='text-right ml-4'>
                  <div className='font-semibold text-common-gray-dark'>
                    ${account.balance.toLocaleString()}
                  </div>
                  {account.available_balance &&
                    account.available_balance !== account.balance && (
                      <div className='text-xs text-common-gray-dark'>
                        ${account.available_balance.toLocaleString()} available
                      </div>
                    )}
                  <Badge
                    variant='outline'
                    className={`text-xs mt-1 ${accountTypeColors[account.account_type]}`}
                  >
                    {account.account_type}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {accounts.length === 0 && (
          <div className='text-center py-8 text-common-gray-dark'>
            <CreditCard className='w-12 h-12 mx-auto mb-3 text-common-gray-dark' />
            <p>No accounts connected yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
