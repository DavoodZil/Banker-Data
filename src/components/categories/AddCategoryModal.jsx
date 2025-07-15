import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Category } from "@/api/entities";

export default function AddCategoryModal({ isOpen, onClose, onSave, category }) {
  const [formData, setFormData] = useState({
    name: '',
    parent_category: '',
    budget_amount: ''
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);
    Category.list().then((response) => {
      // Combine both categories and yd_categories arrays and clean names
      const allCategories = [
        ...(response.categories || []),
        ...(response.yd_categories || [])
      ].map(category => ({
        ...category,
        name: category.name ? category.name.replace(/&nbsp;/g, ' ').trim() : category.name
      }));
      setCategories(allCategories);
      setLoadingCategories(false);
    }).catch(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        parent_category: category.parent_category || '',
        budget_amount: category.budget_amount || ''
      });
    } else {
      setFormData({
        name: '',
        parent_category: '',
        budget_amount: ''
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      budget_amount: parseFloat(formData.budget_amount) || null
    });
  };

  // Exclude current category from parent options (for edit)
  const parentOptions = categories.filter(
    (cat) => !category || cat.id !== category.id
  );

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
              value={formData.name}
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
              {parentOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" size="sm">
              {category ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}