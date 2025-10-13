import {
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Edit, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCategories } from '@/hooks/api';
import { transactionApi } from '@/api/client';

import 'ag-grid-community/styles/ag-grid.css';

ModuleRegistry.registerModules([AllCommunityModule]);

function getCategoryColor(categoryName, parentName) {
  const colorClasses = [
    'bg-common-green-secondary text-common-green-dark ',
    'bg-common-yellow-secondary text-common-yellow-dark ',
    'bg-common-blue-secondary text-common-blue-dark ',
    'bg-purple-50 text-purple-700 border-purple-200',
    'bg-common-red-secondary text-common-red-dark ',
    'bg-cyan-50 text-cyan-700 border-cyan-200',
    'bg-pink-50 text-pink-700 border-pink-200',
    'bg-lime-50 text-lime-700 border-lime-200',
    'bg-common-green-secondary text-common-green-dark ',
    'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bg-common-orange-secondary text-common-orange-dark ',
    'bg-teal-50 text-teal-700 border-teal-200',
  ];

  const str = parentName || categoryName || 'uncategorized';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colorClasses[Math.abs(hash) % colorClasses.length];
}

/**
 * Custom cell renderer for description column
 * @param {Object} data - Transaction data
 * @param {Array} accounts - Array of account objects
 * @returns {JSX.Element} Rendered description cell
 */
const DescriptionCellRenderer = ({ data }) => {
  const isPositive = data.amountAmount > 0;

  return (
    <div className='flex items-center gap-2'>
      <div
        className={`p-1 rounded-full ${isPositive ? 'bg-common-green-secondary' : 'bg-common-red-secondary'}`}
      >
        {isPositive ? (
          <ArrowUpRight className='w-3 h-3 text-common-green' />
        ) : (
          <ArrowDownRight className='w-3 h-3 text-common-red' />
        )}
      </div>
      <div>
        <div className='font-medium'>
          {data.description_custom ||
            data.original_description ||
            'No description'}
        </div>
        {data.merchant_name_custom || data.merchant_name ? (
          <div className='text-sm text-common-gray-dark'>
            {data.merchant_name_custom || data.merchant_name}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Custom cell renderer for account column
 * @param {Object} data - Transaction data
 * @param {Array} accounts - Array of account objects
 * @returns {JSX.Element} Rendered account cell
 */
const AccountCellRenderer = ({ data, accounts }) => {
  const accountName =
    data.bank_account?.account_name ||
    accounts.find(a => a.id === data.account_id)?.account_name ||
    'Unknown';

  return (
    <div>
      <div className='text-sm'>{accountName}</div>
      <div className='text-xs text-common-gray-dark'>
        {data.bank_account?.institution_name || 'Bank Account'}
      </div>
    </div>
  );
};

/**
 * Custom cell renderer for category column
 * @param {Object} data - Transaction data
 * @param {Object} categories - Categories object
 * @returns {JSX.Element} Rendered category cell
 */
const CategoryCellRenderer = ({ data, categories }) => {
  const categoryName =
    data.sub_category?.name ||
    data.personal_finance_category?.name ||
    data.category_id_custom ||
    'uncategorized';

  const parentName = data.personal_finance_category?.name || '';

  const category = categories?.find(
    c => c.name === categoryName || c.enc_id === data.category_id_custom
  );

  const displayName = category
    ? `${category.parent_name} - ${category.name}`
    : categoryName.replace(/_/g, ' ').toLowerCase();

  return (
    <Badge
      variant='outline'
      className={`${getCategoryColor(categoryName, parentName)} text-xs`}
    >
      {displayName}
    </Badge>
  );
};

/**
 * Custom cell renderer for amount column
 * @param {Object} data - Transaction data
 * @returns {JSX.Element} Rendered amount cell
 */
const AmountCellRenderer = ({ data }) => {
  const isPositive = data.amountAmount > 0;

  return (
    <div
      className={`font-semibold ${isPositive ? 'text-common-green' : 'text-common-red'}`}
    >
      {isPositive ? '+' : ''}${Math.abs(data.amountAmount).toLocaleString()}
    </div>
  );
};

/**
 * Custom cell renderer for actions column
 * @param {Object} data - Transaction data
 * @param {Function} onEditTransaction - Callback for editing transaction
 * @returns {JSX.Element} Rendered actions cell
 */
const ActionsCellRenderer = ({ data, onEditTransaction }) => {
  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => onEditTransaction && onEditTransaction(data)}
      className='h-8 w-8 p-0'
    >
      <Edit className='w-4 h-4' />
    </Button>
  );
};

const PaginatedTransactionTable = forwardRef(function PaginatedTransactionTable(
  { accounts = [], onEditTransaction, filters = {} },
  ref
) {
  const gridApiRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [noData] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalRows, setTotalRows] = useState(0);
  const { childCategories } = useCategories();

  /**
   * Handles navigation to the first page
   * @returns {void}
   */
  const handleFirstPage = useCallback(() => {
    setCurrentPage(0);
  }, []);

  /**
   * Handles navigation to the previous page
   * @returns {void}
   */
  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => prev - 1);
  }, []);

  /**
   * Handles navigation to the next page
   * @returns {void}
   */
  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  /**
   * Handles navigation to the last page
   * @returns {void}
   */
  const handleLastPage = useCallback(() => {
    setCurrentPage(Math.ceil(totalRows / pageSize) - 1);
  }, [totalRows, pageSize]);

  /**
   * Loads transactions with pagination
   * @param {number} page - The page number to load
   * @param {number} size - The page size
   * @returns {Promise<void>}
   */
  const loadTransactions = useCallback(
    async (page = currentPage, size = pageSize) => {
      setLoading(true);

      const payload = {
        ...filters,
        startRow: page * size,
        endRow: page * size + size,
        sortModel: [],
        filterModel: {},
      };

      try {
        const response = await transactionApi.list(payload);
        const { data } = response;

        const processedData = (data.rowData || []).map(transaction => ({
          ...transaction,
          amountAmount:
            parseFloat(transaction.amount || transaction.amountAmount) || 0,
        }));

        setRowData(processedData);
        setTotalRows(data.rowCount || 0);
        setNoData(processedData.length === 0);
      } catch {
        setRowData([]);
        setTotalRows(0);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    },
    [filters, currentPage, pageSize]
  );

  useEffect(() => {
    loadTransactions(currentPage, pageSize);
  }, [filters, currentPage, pageSize]);

  useImperativeHandle(ref, () => ({
    refresh: loadTransactions,
  }));

  const columnDefs = useMemo(
    () => [
      {
        headerName: 'Date',
        field: 'date',
        width: 120,
        cellRenderer: params => {
          return params.value
            ? format(new Date(params.value), 'MMM d, yyyy')
            : '-';
        },
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Description',
        field: 'description_custom',
        flex: 2,
        cellRenderer: params => (
          <DescriptionCellRenderer data={params.data} accounts={accounts} />
        ),
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Merchant',
        field: 'merchant_name',
        flex: 2,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Account',
        field: 'account_id',
        width: 150,
        cellRenderer: params => (
          <AccountCellRenderer data={params.data} accounts={accounts} />
        ),
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Category',
        field: 'personal_finance_category.name',
        width: 120,
        cellRenderer: params => (
          <CategoryCellRenderer
            data={params.data}
            categories={childCategories}
          />
        ),
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Amount',
        field: 'amountAmount',
        width: 120,
        cellRenderer: params => <AmountCellRenderer data={params.data} />,
        sortable: true,
        filter: false,
        type: 'numericColumn',
      },
      {
        headerName: 'Type',
        field: 'base_type',
        width: 100,
        sortable: true,
        filter: false,
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 80,
        cellRenderer: params => (
          <ActionsCellRenderer
            data={params.data}
            onEditTransaction={onEditTransaction}
          />
        ),
        sortable: false,
        filter: false,
      },
    ],
    [accounts, onEditTransaction, childCategories]
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: false,
    }),
    []
  );


  const SkeletonTable = () => (
    <div className='w-full space-y-4'>
      {/* Header skeleton */}
      <div className='grid grid-cols-7 gap-4 p-4 bg-common-gray-light rounded-t-lg'>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className='h-6 w-full' />
        ))}
      </div>

      {/* Rows skeleton */}
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className='grid grid-cols-7 gap-4 p-4 border-b'>
          {Array.from({ length: 7 }).map((_, colIndex) => (
            <div key={colIndex} className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              {colIndex === 1 && <Skeleton className='h-3 w-3/4' />}
            </div>
          ))}
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className='flex justify-between items-center p-4 bg-common-gray-light rounded-b-lg'>
        <Skeleton className='h-6 w-32' />
        <div className='flex gap-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-8' />
          ))}
        </div>
        <Skeleton className='h-6 w-24' />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='w-full h-full'>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className='w-full h-full'>
      <style>{`
        .enhanced-grid {
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
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

        .enhanced-grid .ag-header-cell .ag-header-cell-menu-button {
          display: none !important;
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
          padding: 8px 16px;
          font-size: 14px;
        }

        .enhanced-grid .ag-paging-button {
          background-color: transparent;
          border: none;
          color: #374151;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          min-width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .enhanced-grid .ag-paging-button:hover:not(:disabled) {
          background-color: #f3f4f6;
        }

        .enhanced-grid .ag-paging-button:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .enhanced-grid .ag-icon {
          font-size: 14px;
          display: inline-block;
        }

        /* Fix pagination arrow icons */
        .enhanced-grid .ag-icon-first::before {
          content: '⟪';
        }
        .enhanced-grid .ag-icon-previous::before {
          content: '‹';
        }
        .enhanced-grid .ag-icon-next::before {
          content: '›';
        }
        .enhanced-grid .ag-icon-last::before {
          content: '⟫';
        }

        .enhanced-grid .ag-icon-first,
        .enhanced-grid .ag-icon-previous,
        .enhanced-grid .ag-icon-next,
        .enhanced-grid .ag-icon-last {
          font-family: inherit;
          font-size: 16px;
          line-height: 1;
        }

        /* Hide filter icons and menu icons */
        .enhanced-grid .ag-header-cell-menu-button,
        .enhanced-grid .ag-floating-filter-button {
          display: none !important;
        }
      `}</style>

      <div className='w-full space-y-4'>
        <div className='h-[500px] enhanced-grid'>
          <AgGridReact
            theme='ag-theme-alpine'
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowModelType='clientSide'
            rowData={rowData}
            pagination={false}
            rowHeight={60}
            headerHeight={50}
            suppressRowClickSelection={true}
            suppressCellFocus={true}
            suppressRowHoverHighlight={false}
            animateRows={true}
            suppressMenuHide={true}
            suppressColumnMoveAnimation={true}
            suppressDragLeaveHidesColumns={true}
            noRowsOverlayComponent='No transactions found matching your criteria'
            suppressNoRowsOverlay={rowData.length === 0}
            onGridReady={params => {
              gridApiRef.current = params.api;
              params.api.sizeColumnsToFit();
            }}
            onFirstDataRendered={params => {
              params.api.sizeColumnsToFit();
            }}
          />
        </div>

        {/* Custom Pagination Controls */}
        <div className='flex items-center justify-between p-4 bg-common-gray-light rounded-lg border'>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-common-gray-dark'>
              Showing {currentPage * pageSize + 1} to{' '}
              {Math.min((currentPage + 1) * pageSize, totalRows)} of {totalRows}{' '}
              entries
            </span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(0);
              }}
              className='px-3 py-1 border border-common-gray-light rounded text-sm'
            >
              {[10, 20, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleFirstPage}
              disabled={currentPage === 0 || loading}
              className='h-8 w-8 p-0'
            >
              ⟪
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePrevPage}
              disabled={currentPage === 0 || loading}
              className='h-8 w-8 p-0'
            >
              ‹
            </Button>

            <span className='px-3 py-1 text-sm'>
              Page {currentPage + 1} of {Math.ceil(totalRows / pageSize) || 1}
            </span>

            <Button
              variant='outline'
              size='sm'
              onClick={handleNextPage}
              disabled={
                currentPage >= Math.ceil(totalRows / pageSize) - 1 || loading
              }
              className='h-8 w-8 p-0'
            >
              ›
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleLastPage}
              disabled={
                currentPage >= Math.ceil(totalRows / pageSize) - 1 || loading
              }
              className='h-8 w-8 p-0'
            >
              ⟫
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PaginatedTransactionTable;
