import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit, Calendar, DollarSign, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import { useCategories } from "@/hooks/api";


export default function TransactionEditModal({ transaction, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    description: '',
    merchantName: '',
    category: '',
    amount: 0
  });
  const [categorySearch, setCategorySearch] = useState('');
  const { categoryHierarchy, loading: categoriesLoading } = useCategories();

  // Format category name by replacing underscores with spaces
  const formatCategoryName = (name) => {
    return name ? name.replace(/_/g, ' ').replace(/&nbsp;/g, ' ').trim() : name;
  };

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description_custom || transaction.original_description || '',
        merchantName: transaction.merchant_name_custom || transaction.merchant_name || '',
        category: transaction.category_id_custom || '',
        amount: Math.abs(parseFloat(transaction.amountAmount || transaction.amount || 0))
      });
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(transaction.id, formData);
  };

  // Transform hierarchical categories for the category selector
  const categoriesForSelector = categoryHierarchy.reduce((acc, parent) => {
    const groupName = formatCategoryName(parent.name);
    
    // Get children categories
    const children = parent.children || [];
    
    // Only add parent if it has children (since parent categories shouldn't be selectable)
    if (children.length > 0) {
      acc[groupName] = {
        icon: FileText,
        emoji: parent.emoji,
        subcategories: children.map(child => ({
          name: formatCategoryName(child.name),
          enc_id: child.enc_id,
          original_name: child.name
        }))
      };
    }
    
    return acc;
  }, {});

  // Filter categories based on search
  const filteredCategories = Object.entries(categoriesForSelector).reduce((acc, [category, { icon, emoji, subcategories }]) => {
    if (!categorySearch) {
      acc[category] = { icon, emoji, subcategories };
      return acc;
    }

    const lowerCaseSearch = categorySearch.toLowerCase();
    const categoryMatches = category.toLowerCase().includes(lowerCaseSearch);
    const matchingSubcategories = subcategories.filter(sub => 
      sub.name.toLowerCase().includes(lowerCaseSearch)
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

  if (!transaction) return null;

  return (
    <>
      <style>{`
        .category-search { 
          position: sticky; 
          top: 0; 
          z-index: 10; 
          background: white; 
          padding: 8px; 
          border-bottom: 1px solid #e5e7eb; 
          margin: -8px -8px 8px -8px; 
        }
        .category-header { 
          font-weight: 600; 
          color: #374151; 
          padding: 8px 12px; 
          background-color: #f9fafb; 
          border-bottom: 1px solid #e5e7eb; 
        }
        .subcategory-item { 
          padding-left: 24px; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
        }
        .subcategory-item::before { 
          content: "•"; 
          color: #9ca3af; 
          font-weight: bold; 
          width: 8px; 
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Transaction
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">
                  {format(new Date(transaction.date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className={`font-semibold ${transaction.amountAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amountAmount > 0 ? '+' : ''}${Math.abs(transaction.amountAmount || transaction.amount || 0).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Original: {transaction.original_description || transaction.description}
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter description..."
                required
              />
            </div>

            {/* Merchant Name */}
            <div className="space-y-2">
              <Label htmlFor="merchantName">Merchant Name</Label>
              <Input
                id="merchantName"
                value={formData.merchantName}
                onChange={(e) => setFormData({...formData, merchantName: e.target.value})}
                placeholder="Enter merchant name..."
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="sticky top-0 z-10 bg-white p-2 border-b">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-9 h-8"
                        onMouseDown={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {Object.entries(filteredCategories).map(([category, { icon: CategoryIcon, emoji, subcategories }]) => (
                      <SelectGroup key={category}>
                        <SelectLabel className="category-header flex items-center gap-2">
                          {emoji ? <span className="text-xl leading-none">{emoji}</span> : <CategoryIcon className="w-4 h-4" />}
                          {category}
                        </SelectLabel>
                        {subcategories.map(subcategory => (
                          <SelectItem key={subcategory.enc_id} value={subcategory.enc_id} className="subcategory-item">
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                    
                    {Object.keys(filteredCategories).length === 0 && categorySearch && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No categories found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  className="pl-7"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}