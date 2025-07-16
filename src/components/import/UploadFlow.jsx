
import React, { useState, useEffect } from 'react';
import { useAccounts } from '@/hooks/api';
import { useTransactions } from '@/hooks/api';
import { useFileUpload, useFileImport } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileUp, CheckCircle, AlertTriangle } from 'lucide-react';

const STEPS = {
  SELECT_ACCOUNT: 1,
  UPLOAD_FILE: 2,
  REVIEW: 3,
  COMPLETE: 4,
};

export default function UploadFlow() {
  const [step, setStep] = useState(STEPS.SELECT_ACCOUNT);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedTransactions, setParsedTransactions] = useState([]);

  // Use the new hooks
  const { accounts: allAccounts, updateAccount } = useAccounts();
  const { createTransaction } = useTransactions();
  const { uploadFile } = useFileUpload();
  const { extractData } = useFileImport();

  // Filter manual accounts
  const manualAccounts = allAccounts.filter(account => account.source === 'manual');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProcessFile = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      // Upload the file
      const uploadResponse = await uploadFile(file);
      
      const fileId = uploadResponse.id;
      
      // Extract data from the uploaded file
      const extractResponse = await extractData(fileId);
      
      if (extractResponse.transactions) {
        setParsedTransactions(extractResponse.transactions);
        setStep(STEPS.REVIEW);
      } else {
        throw new Error("Could not extract transactions from the file. Please ensure it has 'Date', 'Description', and 'Amount' columns.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const transactionsToCreate = parsedTransactions.map(tx => ({
        account_id: selectedAccountId,
        date: new Date(tx.Date).toISOString().split('T')[0],
        description: tx.Description,
        amount: tx.Amount,
        category: tx.Category ? tx.Category.toLowerCase().replace(/ /g, '_') : 'uncategorized',
      }));

      // Create transactions one by one using the hook
      for (const tx of transactionsToCreate) {
        await createTransaction(tx);
      }
      
      // Update account balance
      const totalImportedAmount = transactionsToCreate.reduce((sum, tx) => sum + tx.amount, 0);
      const account = manualAccounts.find(a => a.id === selectedAccountId);
      if (account) {
          await updateAccount(account.id, { balance: account.balance + totalImportedAmount });
      }

      setStep(STEPS.COMPLETE);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    switch(step) {
      case STEPS.SELECT_ACCOUNT:
        return (
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Choose the manual account you want to import transactions into.</p>
            <Select onValueChange={setSelectedAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an account..." />
              </SelectTrigger>
              <SelectContent>
                {manualAccounts.map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>{acc.account_name} ({acc.institution_name})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setStep(STEPS.UPLOAD_FILE)} disabled={!selectedAccountId}>Continue</Button>
          </CardContent>
        );
      case STEPS.UPLOAD_FILE:
        return (
          <CardContent className="space-y-4 text-center">
            <div className="mx-auto w-fit">
              <label htmlFor="csv-upload" className="cursor-pointer space-y-2">
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-emerald-500">
                  <FileUp className="w-8 h-8" />
                </div>
                <Input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                <p className="text-sm text-gray-600">{file ? file.name : "Click to upload a CSV"}</p>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(STEPS.SELECT_ACCOUNT)}>Back</Button>
                <Button onClick={handleProcessFile} disabled={!file || isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Process File"}
                </Button>
            </div>
          </CardContent>
        );
      case STEPS.REVIEW:
        return (
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">Review the {parsedTransactions.length} transactions found in your file.</p>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedTransactions.slice(0, 10).map((tx, i) => (
                    <TableRow key={i}>
                      <TableCell>{tx.Date}</TableCell>
                      <TableCell>{tx.Description}</TableCell>
                      <TableCell>{tx.Category || 'N/A'}</TableCell>
                      <TableCell className={`text-right ${tx.Amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${tx.Amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {parsedTransactions.length > 10 && <p className="text-center text-sm text-gray-500 mt-2">...and {parsedTransactions.length - 10} more</p>}
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setStep(STEPS.UPLOAD_FILE)}>Back</Button>
                <Button onClick={handleImport} disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Confirm & Import"}
                </Button>
            </div>
          </CardContent>
        );
        case STEPS.COMPLETE:
            return (
                <CardContent className="text-center space-y-4 py-8">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto"/>
                    <h3 className="text-xl font-semibold">Import Complete!</h3>
                    <p>{parsedTransactions.length} transactions have been successfully added.</p>
                    <Button onClick={() => setStep(STEPS.SELECT_ACCOUNT)}>Import Another File</Button>
                </CardContent>
            );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Wizard</CardTitle>
        <CardDescription>Follow these steps to import your transactions.</CardDescription>
      </CardHeader>
      {renderContent()}
    </Card>
  );
}
