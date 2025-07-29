import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCategories } from "@/hooks/api";
import { Loader2 } from "lucide-react";

export default function AddCategoryModal({ isOpen, onClose, onSave, category, isSaving = false }) {
  const [formData, setFormData] = useState({
    name: '',
    parent_category: '',
    budget_amount: '',
    encrypted_id: ''
  });

  

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
      parent: formData.parent_category, // This will be the parent category's enc_id
      budget_amount: parseFloat(formData.budget_amount) || null
    });
  };

  // Create options for parent selection - only show parent categories
  const parentOptions = categoryHierarchy.filter((cat) => !category || cat.enc_id !== category.enc_id);
  

  return (
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
            <Label htmlFor="parent_category" className="text-sm font-medium">Parent Category</Label>
            <select
              id="parent_category"
              className="h-9 w-full border border-gray-300 rounded-md px-2"
              value={formData.parent_category}
              onChange={(e) => setFormData({ ...formData, parent_category: e.target.value })}
              disabled={loadingCategories}
            >
              <option value="">None</option>
              {parentOptions.map((parent) => (
                <option 
                  key={parent.enc_id} 
                  value={parent.enc_id}
                >
                  {formatCategoryName(parent.name)}
                </option>
              ))}
            </select>
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
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" size="sm" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}