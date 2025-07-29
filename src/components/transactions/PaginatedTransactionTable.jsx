import React, { useMemo } from "react";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTransactions } from "@/hooks/api";

// Import ag-Grid styles - using new Theming API
import 'ag-grid-community/styles/ag-grid.css';

// Register ag-Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const categoryColors = {
  groceries: "bg-green-50 text-green-700 border-green-200",
  dining: "bg-yellow-50 text-yellow-700 border-yellow-200",
  transportation: "bg-blue-50 text-blue-700 border-blue-200",
  entertainment: "bg-purple-50 text-purple-700 border-purple-200",
  utilities: "bg-red-50 text-red-700 border-red-200",
  healthcare: "bg-cyan-50 text-cyan-700 border-cyan-200",
  shopping: "bg-pink-50 text-pink-700 border-pink-200",
  travel: "bg-lime-50 text-lime-700 border-lime-200",
  income: "bg-emerald-50 text-emerald-700 border-emerald-200",
  investments: "bg-indigo-50 text-indigo-700 border-indigo-200",
  uncategorized: "bg-gray-50 text-gray-700 border-gray-200"
};

// Custom cell renderer for description column
const DescriptionCellRenderer = ({ data, accounts }) => {
  const isPositive = data.amountAmount > 0;
  
  return (
    <div className="flex items-center gap-2">
      <div className={`p-1 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3 text-green-600" />
        ) : (
          <ArrowDownRight className="w-3 h-3 text-red-600" />
        )}
      </div>
      <div>
        <div className="font-medium">
          {data.description_custom || data.original_description || 'No description'}
        </div>
        {data.merchant_name_custom || data.merchant_name ? (
          <div className="text-sm text-gray-500">
            {data.merchant_name_custom || data.merchant_name}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Custom cell renderer for account column
const AccountCellRenderer = ({ data, accounts }) => {
  // Use nested bank_account object if available, otherwise fall back to accounts array
  const accountName = data.bank_account?.account_name || 
    accounts.find(a => a.id === data.account_id)?.account_name || 
    'Unknown';
  
  return (
    <div>
      <div className="text-sm">
        {accountName}
      </div>
      <div className="text-xs text-gray-500">
        {data.bank_account?.institution_name || 'Bank Account'}
      </div>
    </div>
  );
};

// Custom cell renderer for category column
const CategoryCellRenderer = ({ data }) => {
  // Use sub_category if not null, otherwise use personal_finance_category name
  const categoryName = data.sub_category?.name || 
    data.personal_finance_category?.name || 
    data.category_id_custom || 
    'uncategorized';
  
  return (
    <Badge 
      variant="outline" 
      className={`${categoryColors[categoryName.toLowerCase()] || categoryColors.uncategorized} text-xs`}
    >
      {categoryName.replace(/_/g, ' ').toLowerCase()}
    </Badge>
  );
};

// Custom cell renderer for amount column
const AmountCellRenderer = ({ data }) => {
  const isPositive = data.amountAmount > 0;
  
  return (
    <div className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? '+' : ''}${Math.abs(data.amountAmount).toLocaleString()}
    </div>
  );
};

// Custom cell renderer for actions column
const ActionsCellRenderer = ({ data, onEditTransaction }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onEditTransaction && onEditTransaction(data)}
      className="h-8 w-8 p-0"
    >
      <Edit className="w-4 h-4" />
    </Button>
  );
};

export default function PaginatedTransactionTable({
  accounts = [],
  onEditTransaction
}) {
  // Use the organized hook for data fetching
  const { transactions, loading, error } = useTransactions();

  // Process transactions to convert amountAmount from string to number
  const processedTransactions = useMemo(() => {
    return (transactions || []).map(transaction => ({
      ...transaction,
      amountAmount: parseFloat(transaction.amountAmount) || 0
    }));
  }, [transactions]);

  // ag-Grid configuration
  const gridOptions = useMemo(() => ({
    theme: 'ag-theme-alpine', // Use new Theming API
    columnDefs: [
      {
        headerName: 'Date',
        field: 'date',
        width: 120,
        cellRenderer: (params) => {
          return params.value ? format(new Date(params.value), "MMM d, yyyy") : "-";
        },
        sortable: false,
        filter: false
      },
      {
        headerName: 'Description',
        field: 'description_custom',
        flex: 2,
        cellRenderer: (params) => <DescriptionCellRenderer data={params.data} accounts={accounts} />,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Account',
        field: 'account_id',
        width: 150,
        cellRenderer: (params) => <AccountCellRenderer data={params.data} accounts={accounts} />,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Category',
        field: 'personal_finance_category.name',
        width: 120,
        cellRenderer: (params) => <CategoryCellRenderer data={params.data} />,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Amount',
        field: 'amountAmount',
        width: 120,
        cellRenderer: (params) => <AmountCellRenderer data={params.data} />,
        sortable: false,
        filter: false,
        type: 'numericColumn'
      },
      {
        headerName: 'Type',
        field: 'base_type',
        width: 100,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 80,
        cellRenderer: (params) => <ActionsCellRenderer data={params.data} onEditTransaction={onEditTransaction} />,
        sortable: false,
        filter: false
      }
    ],
    defaultColDef: {
      resizable: true,
      sortable: false,
      filter: false
    },
    pagination: false,
    rowData: processedTransactions,
    rowHeight: 60,
    headerHeight: 50,
    suppressRowClickSelection: true,
    suppressCellFocus: true,
    suppressRowHoverHighlight: false,
    animateRows: true,
    loadingOverlayComponent: 'Loading...',
    noRowsOverlayComponent: 'No transactions found matching your criteria',
    onGridReady: (params) => {
      params.api.sizeColumnsToFit();
    },
    onFirstDataRendered: (params) => {
      params.api.sizeColumnsToFit();
    }
  }), [processedTransactions, accounts, onEditTransaction]);

  return (
    <div className="w-full h-full">
      <style jsx>{`
        .enhanced-grid {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
        }
        
        .enhanced-grid .ag-header {
          background-color: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .enhanced-grid .ag-header-cell {
          background-color: #f8fafc;
          color: #374151;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 16px;
          border-right: 1px solid #e5e7eb;
        }
        
        .enhanced-grid .ag-header-cell:last-child {
          border-right: none;
        }
        
        .enhanced-grid .ag-row {
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.15s ease;
        }
        
        .enhanced-grid .ag-row:hover {
          background-color: #f9fafb;
        }
        
        .enhanced-grid .ag-row:nth-child(even) {
          background-color: #fafbfc;
        }
        
        .enhanced-grid .ag-row:nth-child(even):hover {
          background-color: #f1f5f9;
        }
        
        .enhanced-grid .ag-cell {
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
          border-right: 1px solid #f3f4f6;
          vertical-align: middle;
        }
        
        .enhanced-grid .ag-cell:last-child {
          border-right: none;
        }
        
        .enhanced-grid .ag-loading-overlay {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(2px);
        }
        
        .enhanced-grid .ag-no-rows-overlay {
          color: #6b7280;
          font-size: 16px;
          font-weight: 500;
        }
        
        .enhanced-grid .ag-paging-panel {
          background-color: #f8fafc;
          border-top: 1px solid #e5e7eb;
          padding: 12px 16px;
        }
        
        .enhanced-grid .ag-paging-button {
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.15s ease;
        }
        
        .enhanced-grid .ag-paging-button:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .enhanced-grid .ag-paging-button:disabled {
          background-color: #f9fafb;
          color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <span className="text-red-600">Error: {error}</span>
        </div>
      )}
      
      {loading ? (
        <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading transactions...</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-[600px] enhanced-grid">
          <AgGridReact
            {...gridOptions}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
          />
        </div>
      )}
    </div>
  );
} 