import React from 'react';
import { Upload } from 'lucide-react';
import UploadFlow from '../components/import/UploadFlow';

export default function ImportPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-common-green-secondary rounded-lg flex items-center justify-center">
          <Upload className="w-6 h-6 text-common-green" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-common-gray-dark">
            Import Transactions
          </h1>
          <p className="text-common-gray-dark mt-1">
            Upload a CSV file from your bank to add transactions to a manual
            account.
          </p>
        </div>
      </div>

      <UploadFlow />
    </div>
  );
}








