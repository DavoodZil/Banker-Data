import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/api";
import { Loader2, Search, Plus, FileText } from "lucide-react";

export default function AddCategoryModal({ isOpen, onClose, onSave, category, isSaving = false }) {
  const [formData, setFormData] = useState({
    name: '',
    parent_category: '',
    budget_amount: '',
    encrypted_id: ''
  });
  const [categorySearch, setCategorySearch] = useState('');

  

  // Use the new hook
  const { categoryHierarchy, loading: loadingCategories } = useCategories();

  // Format category name by replacing underscores with spaces
  const formatCategoryName = (name) => {
    return name ? name.replace(/_/g, ' ').replace(/&nbsp;/g, ' ').trim() : name;
  };

  useEffect(() => {
    if (category) {
      const parentValue = category.parent_category || category.parent_id || '';
      setFormData({
        name: category.name.replace(/&nbsp;/g, ' ').trim() || '',
        parent_category: parentValue,
        budget_amount: category.budget_amount || '',
        encrypted_id: category.encrypted_id || ''
      });
    } else {
      setFormData({
        name: '',
        parent_category: '',
        budget_amount: '',
        encrypted_id: ''
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the parent category's enc_id as 'parent' to the backend
    onSave({
      ...formData,
      parent: formData.parent_category, // Parent is required
      budget_amount: parseFloat(formData.budget_amount) || null
    });
  };

  // Transform hierarchical categories for the category selector
  const categoriesForSelector = categoryHierarchy.reduce((acc, parent) => {
    const groupName = formatCategoryName(parent.name);
    
    // Get children categories
    const children = parent.children || [];
    
    // Only add parent if it has children (since parent categories shouldn't be selectable)
    if (children.length > 0) {
      acc[groupName] = {
        icon: FileText, // Default icon
        emoji: parent.emoji,
        subcategories: children
          .filter(child => !category || child.enc_id !== category.enc_id) // Skip current category if editing
          .map(child => ({
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
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {category ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Category Name</Label>
            <Input
              id="name"
              value={formatCategoryName(formData.name)}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Coffee & Snacks"
              className="h-9"
              required
            />
          </div>

          {/* Parent Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="parent_category" className="text-sm font-medium">
              Parent Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.parent_category}
              onValueChange={(value) => setFormData({ ...formData, parent_category: value })}
              disabled={loadingCategories}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select a parent category" />
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

          {/* Monthly Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget_amount" className="text-sm font-medium">Monthly Budget (Optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <Input
                id="budget_amount"
                type="number"
                step="0.01"
                value={formData.budget_amount}
                onChange={(e) => setFormData({ ...formData, budget_amount: e.target.value })}
                placeholder="0.00"
                className="pl-7 h-9"
              />
            </div>
            <p className="text-xs text-gray-500">
              Set a monthly spending limit for this category
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} size="sm" disabled={isSaving}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700" 
              size="sm" 
              disabled={isSaving || !formData.parent_category}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}