import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tag } from "lucide-react";

const colorOptions = [
  { color: '#f87171', name: 'Red' },
  { color: '#fb923c', name: 'Orange' },
  { color: '#facc15', name: 'Yellow' },
  { color: '#4ade80', name: 'Green' },
  { color: '#34d399', name: 'Emerald' },
  { color: '#22d3ee', name: 'Cyan' },
  { color: '#60a5fa', name: 'Blue' },
  { color: '#a78bfa', name: 'Purple' },
  { color: '#f472b6', name: 'Pink' },
  { color: '#78716c', name: 'Stone' }
];

export default function CreateTagModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(colorOptions[0].color);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), color });
    setName('');
    setColor(colorOptions[0].color);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            Create New Tag
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tagName" className="text-sm font-medium text-gray-700">
              Tag Name
            </Label>
            <Input
              id="tagName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Reimbursable, Work, Personal"
              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Tag Color
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  type="button"
                  className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 flex items-center justify-center ${
                    color === option.color 
                      ? 'ring-2 ring-offset-2 ring-emerald-500 border-white' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: option.color }}
                  onClick={() => setColor(option.color)}
                  title={option.name}
                >
                  {color === option.color && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Label className="text-sm font-medium text-gray-600 mb-2 block">
              Preview
            </Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {name || 'Tag Name'}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!name.trim()}
            >
              Create Tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}