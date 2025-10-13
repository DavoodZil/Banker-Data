import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, Trash2, Edit, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAccounts } from '@/hooks/api';

const AccountCard = React.memo(({ account, showBalance, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { deleteAccount } = useAccounts();

  /**
   * Handles account deletion
   * @param {Event} e - The click event
   * @returns {Promise<void>}
   */
  const handleDelete = async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await deleteAccount(account.id);
      setShowDeleteDialog(false);
      onUpdate();
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Opens the delete confirmation dialog
   * @param {Event} e - The click event
   * @returns {void}
   */
  const openDeleteDialog = e => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const cardColors = {
    checking: 'border-common-blue bg-common-blue-secondary',
    savings: 'border-common-green bg-common-green-secondary',
    credit: 'border-common-red bg-common-red-secondary',
    investment: 'border-common-violet bg-common-violet-secondary',
    loan: 'border-common-orange bg-common-orange-secondary',
  };

  const headerColors = {
    checking: 'text-common-blue-dark',
    savings: 'text-common-green-dark',
    credit: 'text-common-red-dark',
    investment: 'text-purple-800',
    loan: 'text-common-orange-dark',
  };

  return (
    <>
      <Card
        className={`group card-shadow-lg border-2 transition-all duration-300 hover:border-common-green h-full ${cardColors[account.account_type] || 'border-common-gray-light'}`}
      >
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle
            className={`text-base font-semibold ${headerColors[account.account_type]}`}
          >
            {account.account_name}
          </CardTitle>
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 opacity-0 group-hover:opacity-100'
            onClick={openDeleteDialog}
          >
            <Trash2 className='w-4 h-4 text-common-gray-dark hover:text-common-red' />
          </Button>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-baseline justify-between'>
            <div>
              <p className='text-xs text-common-gray-dark'>Current Balance</p>
              <p className='text-2xl font-bold text-common-gray-dark'>
                {showBalance
                  ? `$${account.available_balance_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '•••••'}
              </p>
            </div>
            {account.available_balance !== null &&
              account.available_balance !== account.balance && (
                <div>
                  <p className='text-xs text-common-gray-dark text-right'>
                    Available
                  </p>
                  <p className='text-lg font-semibold text-common-green-dark'>
                    {showBalance
                      ? `$${account.available_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : '•••••'}
                  </p>
                </div>
              )}
          </div>

          <div className='flex items-center justify-between text-xs text-common-gray-dark pt-3 border-t'>
            <span>{account.name}</span>
            <span>•••• {account.account_number_last_four}</span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='w-5 h-5 text-common-red' />
              Remove Account Connection
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect the account for{' '}
              <strong>{account.account_name}</strong> (
              {account.institution_name}) and remove all its associated
              transactions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={e => {
                e.stopPropagation();
                setShowDeleteDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-common-red hover:bg-common-red-dark'
            >
              {isDeleting ? 'Removing...' : 'Yes, Remove Connection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

AccountCard.displayName = 'AccountCard';

export default AccountCard;
