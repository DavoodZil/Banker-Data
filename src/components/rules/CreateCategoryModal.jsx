import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search } from 'lucide-react';

const availableEmojis = [
  { emoji: '💰', name: 'money bag' },
  { emoji: '💳', name: 'credit card' },
  { emoji: '🏠', name: 'house' },
  { emoji: '🚗', name: 'car' },
  { emoji: '🍔', name: 'hamburger' },
  { emoji: '✈️', name: 'airplane' },
  { emoji: '🛍️', name: 'shopping bags' },
  { emoji: '💊', name: 'pill' },
  { emoji: '🎬', name: 'clapper board' },
  { emoji: '📱', name: 'mobile phone' },
  { emoji: '⚡', name: 'high voltage' },
  { emoji: '🎓', name: 'graduation cap' },
  { emoji: '🎁', name: 'wrapped gift' },
  { emoji: '🏥', name: 'hospital' },
  { emoji: '🍕', name: 'pizza' },
  { emoji: '☕', name: 'coffee' },
  { emoji: '🚌', name: 'bus' },
  { emoji: '🎮', name: 'video game' },
  { emoji: '📚', name: 'books' },
  { emoji: '💡', name: 'light bulb' },
  { emoji: '🎵', name: 'musical note' },
  { emoji: '🏃', name: 'runner' },
  { emoji: '💻', name: 'laptop' },
  { emoji: '🔧', name: 'wrench' },
  { emoji: '🎨', name: 'artist palette' },
  { emoji: '📈', name: 'chart increasing' },
  { emoji: '💎', name: 'gem stone' },
  { emoji: '🌟', name: 'glowing star' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '❤️', name: 'red heart' },
  { emoji: '🎯', name: 'direct hit' },
  { emoji: '🌍', name: 'globe' },
  { emoji: '🏆', name: 'trophy' },
  { emoji: '⭐', name: 'star' },
  { emoji: '🚀', name: 'rocket' },
  { emoji: '💼', name: 'briefcase' },
  { emoji: '🏪', name: 'convenience store' },
  { emoji: '🎪', name: 'circus tent' },
  { emoji: '🎊', name: 'confetti ball' },
  { emoji: '🎈', name: 'balloon' },
];

const categoryGroups = [
  'Income',
  'Gifts & Donations',
  'Auto & Transport',
  'Housing',
  'Bills & Utilities',
  'Food & Dining',
  'Travel & Lifestyle',
  'Personal',
  'Shopping',
  'Financial',
  'Other',
  'Business',
  'Transfers',
];

export default function CreateCategoryModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '💰',
    group: '',
    excludeFromBudget: false,
  });
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      name: '',
      emoji: '💰',
      group: '',
      excludeFromBudget: false,
    });
    setEmojiSearch('');
  };

  const handleEmojiSelect = (emoji) => {
    setFormData({ ...formData, emoji: emoji });
    setEmojiPopoverOpen(false);
    setEmojiSearch('');
  };

  const filteredEmojis = useMemo(() => {
    const searchTerm = emojiSearch.toLowerCase().trim();
    return availableEmojis.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
  }, [emojiSearch]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emoji & Name Row */}
          <div className="flex items-start gap-3">
            {/* Emoji Selector */}
            <div className="space-y-2">
              <Label>Emoji</Label>
              <Popover
                open={emojiPopoverOpen}
                onOpenChange={setEmojiPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-16 h-10 text-xl p-0 flex justify-center items-center"
                  >
                    {formData.emoji}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-common-gray-dark" />
                      <Input
                        placeholder="Search emoji..."
                        className="pl-9"
                        value={emojiSearch}
                        onChange={(e) => setEmojiSearch(e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto pr-2">
                      {filteredEmojis.length > 0 ? (
                        filteredEmojis.map((item) => (
                          <button
                            key={item.emoji}
                            type="button"
                            className={`p-2 rounded-md border-2 text-lg transition-colors hover:bg-common-gray-light ${
                              formData.emoji === item.emoji
                                ? 'border-common-green bg-common-green-secondary'
                                : 'border-transparent'
                            }`}
                            onClick={() => handleEmojiSelect(item.emoji)}
                            title={item.name}
                          >
                            {item.emoji}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-8 text-center py-4 text-sm text-common-gray-dark">
                          {`No emojis found for "${emojiSearch}"`}
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Name */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Coffee Shops"
                required
              />
            </div>
          </div>

          {/* Category Preview */}
          <div className="p-3 bg-common-gray-light rounded-lg border-2 border-dashed border-common-gray-light">
            <Label className="text-sm text-common-gray-dark mb-2 block">Preview</Label>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{formData.emoji}</span>
              <span className="font-medium text-common-gray-dark text-lg">
                {formData.name || 'Category Name'}
              </span>
            </div>
          </div>

          {/* Group Section */}
          <div className="space-y-3">
            <Label>Group</Label>
            <Select
              value={formData.group}
              onValueChange={(value) =>
                setFormData({ ...formData, group: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {categoryGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Exclusion Option */}
          <div className="space-y-3">
            <Label>Budget Settings</Label>
            <div className="flex items-center justify-between p-3 bg-common-gray-light rounded-lg">
              <div>
                <Label htmlFor="excludeBudget" className="font-medium">
                  Exclude from budget
                </Label>
                <p className="text-sm text-common-gray-dark mt-1">
                  This category won't be included in budget calculations
                </p>
              </div>
              <Switch
                id="excludeBudget"
                checked={formData.excludeFromBudget}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, excludeFromBudget: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-common-green hover:bg-common-green-dark"
              disabled={!formData.name.trim() || !formData.group}
            >
              Save Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}








