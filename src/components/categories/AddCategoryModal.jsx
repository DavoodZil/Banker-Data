import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const colorOptions = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444',
  '#06b6d4', '#84cc16', '#ec4899', '#6366f1', '#f97316'
];

const iconOptions = [
  '🛒', '🍽️', '🚗', '🎬', '⚡', '🏥', '🛍️', '✈️', '💰', '📊',
  '🎵', '🏃', '💻', '🔧', '🎨', '📈', '💎', '🌟', '🔥', '❤️'
];

export default function AddCategoryModal({ isOpen, onClose, onSave, category }) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#10b981',
    icon: '💰',
    budget_amount: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || '#10b981',
        icon: category.icon || '💰',
        budget_amount: category.budget_amount || ''
      });
    } else {
      setFormData({
        name: '',
        color: '#10b981',
        icon: '💰',
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
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Coffee & Snacks"
              className="h-9"
              required
            />
          </div>

          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="appearance" className="text-xs">Appearance</TabsTrigger>
              <TabsTrigger value="budget" className="text-xs">Budget</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4 mt-4">
              {/* Icon Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Icon</Label>
                <div className="grid grid-cols-10 gap-1">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`w-8 h-8 rounded-md text-lg flex items-center justify-center transition-all hover:bg-gray-100 ${
                        formData.icon === icon ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'bg-gray-50'
                      }`}
                      onClick={() => setFormData({...formData, icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-7 h-7 rounded-md border-2 transition-all ${
                        formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({...formData, color})}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="budget" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="budget_amount" className="text-sm font-medium">Monthly Budget (Optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <Input
                    id="budget_amount"
                    type="number"
                    step="0.01"
                    value={formData.budget_amount}
                    onChange={(e) => setFormData({...formData, budget_amount: e.target.value})}
                    placeholder="0.00"
                    className="pl-7 h-9"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Set a monthly spending limit for this category
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <Label className="text-xs text-gray-600 mb-2 block">Preview</Label>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${formData.color}15`, color: formData.color }}
              >
                {formData.icon}
              </div>
              <div>
                <span className="font-medium text-gray-800 text-sm capitalize">
                  {formData.name || 'Category Name'}
                </span>
                {formData.budget_amount && (
                  <div className="text-xs text-gray-500">
                    ${parseFloat(formData.budget_amount).toLocaleString()} budget
                  </div>
                )}
              </div>
            </div>
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