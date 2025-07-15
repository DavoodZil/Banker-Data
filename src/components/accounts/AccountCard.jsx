
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Landmark, Trash2, Edit, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { removeAccount } from "@/api/functions";

export default function AccountCard({ account, showBalance, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await removeAccount({ item_id: account.plaid_item_id });
      setShowDeleteDialog(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to remove account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  }

  const cardColors = {
    checking: "border-blue-200 bg-blue-50",
    savings: "border-green-200 bg-green-50",
    credit: "border-red-200 bg-red-50",
    investment: "border-purple-200 bg-purple-50",
    loan: "border-orange-200 bg-orange-50",
  };
  
  const headerColors = {
    checking: "text-blue-800",
    savings: "text-green-800",
    credit: "text-red-800",
    investment: "text-purple-800",
    loan: "text-orange-800",
  };

  return (
    <>
      <Card className={`group card-shadow-lg border-2 transition-all duration-300 hover:border-emerald-400 h-full ${cardColors[account.account_type] || 'border-gray-200'}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className={`text-base font-semibold ${headerColors[account.account_type]}`}>{account.account_name}</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={openDeleteDialog}>
             <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {showBalance ? `$${account.available_balance_amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '•••••'}
              </p>
            </div>
            {account.available_balance !== null && account.available_balance !== account.balance && (
               <div>
                  <p className="text-xs text-gray-500 text-right">Available</p>
                  <p className="text-lg font-semibold text-emerald-700">
                     {showBalance ? `$${account.available_balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '•••••'}
                  </p>
               </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t">
            <span>{account.name}</span>
            <span>•••• {account.account_number_last_four}</span>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Remove Account Connection
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect the account for <strong>{account.account_name}</strong> ({account.institution_name}) and remove all its associated transactions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={(e) => { e.stopPropagation(); setShowDeleteDialog(false); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Removing..." : "Yes, Remove Connection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
