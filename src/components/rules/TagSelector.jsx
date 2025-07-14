import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ChevronsUpDown, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export default function TagSelector({ allTags, selectedTags, onTagsChange, onCreateNew }) {
  const [open, setOpen] = useState(false);

  const selectedTagObjects = useMemo(() => {
    return allTags.filter(tag => selectedTags.includes(tag.name));
  }, [allTags, selectedTags]);

  const handleTagToggle = (tagName) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    onTagsChange(newSelectedTags);
  };

  const handleRemoveTag = (tagName) => {
    const newSelectedTags = selectedTags.filter(t => t !== tagName);
    onTagsChange(newSelectedTags);
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags Display */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {selectedTagObjects.map(tag => (
            <div 
              key={tag.name}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium shadow-sm"
              style={{ borderRadius: '20px' }}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <span>{tag.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.name)}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors ml-1"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tag Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open} 
            className="w-full justify-between h-10 bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {selectedTagObjects.length === 0 ? 'Add tags...' : `Add more tags (${selectedTagObjects.length} selected)`}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-lg border-gray-200">
          <Command>
            <CommandInput 
              placeholder="Search tags..." 
              className="border-none focus:ring-0 text-sm"
            />
            <CommandList className="max-h-48">
              <CommandEmpty className="py-6 text-center text-sm text-gray-500">
                No tags found.
              </CommandEmpty>
              <CommandGroup>
                {allTags.map(tag => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <CommandItem
                      key={tag.name}
                      onSelect={() => handleTagToggle(tag.name)}
                      className="flex items-center space-x-3 py-2 px-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`tag-${tag.name}`}
                        checked={isSelected}
                        onCheckedChange={() => handleTagToggle(tag.name)}
                        className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-gray-500 data-[state=checked]:border-gray-500 data-[state=checked]:text-white transition-colors focus-visible:ring-1 focus-visible:ring-gray-400"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {tag.name}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <Separator className="bg-gray-200" />
          <div className="p-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 h-9 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors" 
              onClick={() => {
                onCreateNew();
                setOpen(false);
              }}
            >
              <Plus className="w-4 h-4" />
              Create new tag
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}