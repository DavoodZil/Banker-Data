import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, DollarSign, Percent, AlertTriangle, Search, GitCommitHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import TagSelector from "./TagSelector";

const reviewers = ["John Smith", "Sarah Johnson", "Mike Wilson", "Emma Davis"];

export default function SplitTransactionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  allTags, 
  splits = [], 
  splitType = 'amount', 
  hideOriginal = false,
  allCategories,
  onCreateCategory
}) {
  const [currentSplitType, setCurrentSplitType] = useState(splitType);
  const [currentSplits, setCurrentSplits] = useState([]); // Changed initial state to empty
  const [currentHideOriginal, setCurrentHideOriginal] = useState(hideOriginal);
  const [validationErrors, setValidationErrors] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [expandedSplits, setExpandedSplits] = useState({}); // Changed initial state to empty
  const [isInitialized, setIsInitialized] = useState(false); // New state for lazy loading
  
  const originalTransactionAmount = 123.45;

  // Reset initialization state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
      setCurrentSplits([]); // Reset splits when closing
      setExpandedSplits({}); // Reset expanded state when closing
      setValidationErrors([]); // Clear validation errors
    }
  }, [isOpen]);

  // Only initialize data when explicitly requested
  const initializeSplitData = () => {
    if (splits && splits.length > 0) {
      const processedSplits = splits.map((split, index) => ({
        ...split,
        merchant: split.merchant || split.description || '',
        id: split.id || index + 1
      }));
      setCurrentSplits(processedSplits);
      // Expand first split by default
      if (processedSplits.length > 0) {
        setExpandedSplits({ [processedSplits[0].id]: true });
      } else {
        setExpandedSplits({});
      }
    } else {
      setCurrentSplits([
        { id: 1, merchant: '', category: '', amount: '', percentage: '', tags: [], review_status: 'none', reviewer: '' }
      ]);
      setExpandedSplits({ 1: true });
    }
    setCurrentHideOriginal(hideOriginal);
    setIsInitialized(true);
  };

  // Auto-validate whenever splits change (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      validateSplits();
    }
  }, [currentSplits, currentSplitType, isInitialized]);

  const addSplit = () => {
    if (!isInitialized) {
      initializeSplitData();
      return;
    }
    
    const newId = Math.max(...currentSplits.map(s => s.id), 0) + 1;
    setCurrentSplits([...currentSplits, {
      id: newId,
      merchant: '',
      category: '',
      amount: '',
      percentage: '',
      tags: [],
      review_status: 'none',
      reviewer: ''
    }]);
  };

  const removeSplit = (id) => {
    if (currentSplits.length > 1) {
      setCurrentSplits(currentSplits.filter(split => split.id !== id));
      // Remove from expanded splits
      setExpandedSplits(prev => {
        const newExpanded = { ...prev };
        delete newExpanded[id];
        return newExpanded;
      });
    }
  };

  const updateSplit = (id, field, value) => {
    setCurrentSplits(currentSplits.map(split => 
      split.id === id ? { ...split, [field]: value } : split
    ));
  };

  const toggleExpandSplit = (id) => {
    setExpandedSplits(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const validateSplits = () => {
    if (!isInitialized) {
      setValidationErrors([]); // Clear errors if not initialized
      return true; // No validation errors if not initialized
    }
    
    const errors = [];
    
    if (currentSplitType === 'amount') {
      const totalAmount = currentSplits.reduce((sum, split) => {
        const amount = parseFloat(split.amount) || 0;
        return sum + amount;
      }, 0);

      if (Math.abs(totalAmount - originalTransactionAmount) > 0.01) {
        const remaining = originalTransactionAmount - totalAmount;
        errors.push(`Split total ($${totalAmount.toFixed(2)}) must equal transaction amount ($${originalTransactionAmount.toFixed(2)}). ${remaining > 0 ? '$' + remaining.toFixed(2) + ' remaining' : 'Over by $' + Math.abs(remaining).toFixed(2)}.`);
      }
      
      const emptySplits = currentSplits.filter(split => !split.amount || parseFloat(split.amount) <= 0);
      if (emptySplits.length > 0) {
        errors.push("All splits must have a valid amount greater than zero");
      }
    } else {
      const totalPercentage = currentSplits.reduce((sum, split) => {
        const percentage = parseFloat(split.percentage) || 0;
        return sum + percentage;
      }, 0);
      
      if (Math.abs(totalPercentage - 100) > 0.01) {
        const remaining = 100 - totalPercentage;
        errors.push(`Total percentage must equal 100% (currently ${totalPercentage.toFixed(2)}%). ${remaining > 0 ? remaining.toFixed(2) + '% remaining' : 'Over by ' + Math.abs(remaining).toFixed(2) + '%'}.`);
      }
      
      const emptySplits = currentSplits.filter(split => !split.percentage || parseFloat(split.percentage) <= 0);
      if (emptySplits.length > 0) {
        errors.push("All splits must have a valid percentage greater than zero");
      }
    }
    
    const incompleteMerchants = currentSplits.filter(split => !split.merchant.trim());
    if (incompleteMerchants.length > 0) {
      errors.push("All splits must have a merchant name");
    }
    
    const incompleteCategories = currentSplits.filter(split => !split.category);
    if (incompleteCategories.length > 0) {
      errors.push("All splits must have a category assigned");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (!isInitialized) {
      // If not initialized, maybe trigger initialization or do nothing.
      // Current behavior from outline is to return.
      return;
    }
    
    if (validateSplits()) {
      onSave({
        splitType: currentSplitType,
        splits: currentSplits,
        hideOriginal: currentHideOriginal
      });
    }
  };

  const getTotalAmount = () => {
    if (!isInitialized) return 0; // Return 0 if not initialized
    
    if (currentSplitType === 'amount') {
      return currentSplits.reduce((sum, split) => {
        return sum + (parseFloat(split.amount) || 0);
      }, 0);
    } else {
      return currentSplits.reduce((sum, split) => {
        return sum + (parseFloat(split.percentage) || 0);
      }, 0);
    }
  };

  const isValidConfiguration = () => {
    // Configuration is valid only if initialized AND no validation errors AND splits exist
    return isInitialized && validationErrors.length === 0 && currentSplits.length > 0;
  };

  const filteredCategories = useMemo(() => {
    if (!allCategories) return {};
    return Object.entries(allCategories).reduce((acc, [category, categoryData]) => {
      const { icon, emoji, subcategories } = categoryData as any;
      if (!categorySearch) {
        acc[category] = { icon, emoji, subcategories };
        return acc;
      }
      const lowerCaseSearch = categorySearch.toLowerCase();
      const categoryMatches = category.toLowerCase().includes(lowerCaseSearch);
      const matchingSubcategories = (subcategories || []).filter((sub: string) => 
        sub.toLowerCase().includes(lowerCaseSearch)
      );
      if (categoryMatches || matchingSubcategories.length > 0) {
        acc[category] = { 
          icon, 
          emoji,
          subcategories: categoryMatches ? subcategories : matchingSubcategories 
        };
      }
      return acc;
    }, {});
  }, [allCategories, categorySearch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <GitCommitHorizontal className="w-6 h-6 text-emerald-600" />
            </div>
            Split Transaction
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Original Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">${originalTransactionAmount.toFixed(2)}</div>
                <div className="flex items-center gap-3 mt-3">
                  <Switch 
                    id="hide-original" 
                    checked={currentHideOriginal} 
                    onCheckedChange={setCurrentHideOriginal}
                    className="data-[state=checked]:bg-blue-600" 
                  />
                  <Label htmlFor="hide-original" className="text-sm text-blue-700">Hide original transaction</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GitCommitHorizontal className="w-5 h-5 text-emerald-600" />
                  Split Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs value={currentSplitType} onValueChange={setCurrentSplitType}>
                  <TabsList className="grid w-full grid-cols-2 bg-white">
                    <TabsTrigger value="amount" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                      <DollarSign className="w-4 h-4 mr-2" />Amount
                    </TabsTrigger>
                    <TabsTrigger value="percentage" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                      <Percent className="w-4 h-4 mr-2" />Percentage
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-emerald-700 font-medium">Current Total:</span>
                  <Badge 
                    variant="outline" 
                    className={`font-semibold ${
                      (isInitialized && currentSplitType === 'amount' && Math.abs(getTotalAmount() - originalTransactionAmount) < 0.01) ||
                      (isInitialized && currentSplitType === 'percentage' && Math.abs(getTotalAmount() - 100) < 0.01)
                        ? 'border-emerald-300 text-emerald-700' 
                        : 'border-red-300 text-red-700'
                    }`}
                  >
                    {currentSplitType === 'amount' ? `$${getTotalAmount().toFixed(2)}` : `${getTotalAmount().toFixed(1)}%`}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {isInitialized && validationErrors.length > 0 && ( // Only show errors if initialized
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {validationErrors.map((error, index) => (
                  <div key={index} className="mb-1 last:mb-0">• {error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Splits Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <GitCommitHorizontal className="w-5 h-5 text-gray-600" />
                Transaction Splits
                {isInitialized && <Badge variant="secondary" className="ml-2">{currentSplits.length}</Badge>}
              </h3>
              <Button 
                onClick={() => !isInitialized ? initializeSplitData() : addSplit()} 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Plus className="w-4 h-4" /> 
                {!isInitialized ? 'Configure Split' : 'Add Split'}
              </Button>
            </div>

            {!isInitialized ? (
              <Card className="bg-gray-50 border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <GitCommitHorizontal className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Ready to Split Transaction
                      </h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        Click "Configure Split" to start breaking down this transaction into multiple parts with different categories and amounts.
                      </p>
                      <Button 
                        onClick={initializeSplitData}
                        className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                      >
                        <GitCommitHorizontal className="w-4 h-4" />
                        Configure Split
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {currentSplits.map((split, index) => (
                    <motion.div
                      key={split.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-slate-50 border-slate-200 hover:shadow-sm transition-shadow">
                        <CardContent className="p-3">
                          {/* Main Split Row */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full text-sm font-semibold text-slate-600 border border-slate-200">
                              {index + 1}
                            </div>
                            
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              <div>
                                <Input
                                  placeholder="Merchant name"
                                  value={split.merchant}
                                  onChange={(e) => updateSplit(split.id, 'merchant', e.target.value)}
                                  className="h-9 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                />
                              </div>
                              
                              <div>
                                <Select value={split.category} onValueChange={(value) => updateSplit(split.id, 'category', value)}>
                                  <SelectTrigger className="h-9 border-gray-300 focus:border-emerald-500 bg-white">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-80">
                                    <div className="sticky top-0 z-10 bg-white p-2 border-b">
                                      <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input
                                          placeholder="Search categories..."
                                          value={categorySearch}
                                          onChange={(e) => setCategorySearch(e.target.value)}
                                          className="pl-9 h-8 border-gray-300"
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onFocus={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="max-h-48 overflow-y-auto">
                                      {Object.entries(filteredCategories).map(([category, { icon: CategoryIcon, emoji, subcategories }]) => (
                                        <SelectGroup key={category}>
                                          <SelectLabel className="flex items-center gap-2 px-3 py-2 font-semibold text-gray-700 bg-gray-50">
                                            {emoji ? <span className="text-lg">{emoji}</span> : CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                                            {category}
                                          </SelectLabel>
                                          {subcategories.map(sub => (
                                            <SelectItem key={sub} value={sub} className="pl-8">
                                              {sub}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      ))}
                                    </div>
                                    
                                    <div className="sticky bottom-0 bg-white border-t p-2">
                                      <Button 
                                        variant="outline" 
                                        className="w-full h-8 text-sm gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                        onClick={onCreateCategory}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      >
                                        <Plus className="w-3 h-3" />
                                        Add New Category
                                      </Button>
                                    </div>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="relative">
                                {currentSplitType === 'amount' && (
                                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                )}
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder={currentSplitType === 'amount' ? '0.00' : '0'}
                                  value={currentSplitType === 'amount' ? split.amount : split.percentage}
                                  onChange={(e) => updateSplit(split.id, currentSplitType, e.target.value)}
                                  className={`h-9 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white ${currentSplitType === 'amount' ? 'pl-8' : 'pr-8'}`}
                                />
                                {currentSplitType === 'percentage' && (
                                  <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Collapsible open={expandedSplits[split.id]}>
                                <CollapsibleTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => toggleExpandSplit(split.id)}
                                    className="h-8 w-8 text-slate-500 hover:text-slate-700"
                                  >
                                    {expandedSplits[split.id] ? 
                                      <ChevronUp className="w-4 h-4" /> : 
                                      <ChevronDown className="w-4 h-4" />
                                    }
                                  </Button>
                                </CollapsibleTrigger>
                              </Collapsible>
                              
                              {currentSplits.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeSplit(split.id)}
                                  className="h-8 w-8 text-slate-500 hover:text-red-500 transition-colors"
                                  title="Delete this split"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Expanded Section */}
                          <Collapsible open={expandedSplits[split.id]}>
                            <CollapsibleContent>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-slate-200"
                              >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Tags Section */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                                    <TagSelector
                                      allTags={allTags}
                                      selectedTags={split.tags}
                                      onTagsChange={(newTags) => updateSplit(split.id, 'tags', newTags)}
                                      onCreateNew={() => {/* Handle create new tag */}}
                                    />
                                  </div>

                                  {/* Review Status Section */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Review Status</Label>
                                    <div className="space-y-2">
                                      <Select 
                                        value={split.review_status} 
                                        onValueChange={(value) => updateSplit(split.id, 'review_status', value)}
                                      >
                                        <SelectTrigger className="border-gray-300 focus:border-emerald-500 bg-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="none">None</SelectItem>
                                          <SelectItem value="needs_review">Needs review</SelectItem>
                                          <SelectItem value="reviewed">Reviewed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      
                                      {split.review_status === 'needs_review' && (
                                        <Select 
                                          value={split.reviewer} 
                                          onValueChange={(value) => updateSplit(split.id, 'reviewer', value)}
                                        >
                                          <SelectTrigger className="border-gray-300 focus:border-emerald-500 bg-white">
                                            <SelectValue placeholder="Assign reviewer" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {reviewers.map(reviewer => (
                                              <SelectItem key={reviewer} value={reviewer}>
                                                {reviewer}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </CollapsibleContent>
                          </Collapsible>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-6 border-t mt-6 bg-gray-50 -mx-6 -mb-6 px-6 pb-4 rounded-b-lg">
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 bg-white">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className={`text-white transition-all ${
              isValidConfiguration() 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isValidConfiguration()}
          >
            {isValidConfiguration() ? 'Save Split Configuration' : 'Configure Split First'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}