
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, ArrowRight, Trash2, PlusCircle, Link2, GitMerge } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccounts } from "@/hooks/api";
import { useEntities } from "@/hooks/api";

export default function ManageEntityRulesModal({ isOpen, onClose }) {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for new rule
  const [newRuleName, setNewRuleName] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [targetEntity, setTargetEntity] = useState("");
  const [openAccountSelector, setOpenAccountSelector] = useState(false);

  // Use the new hooks
  const { accounts } = useAccounts();
  const { entities } = useEntities();

  useEffect(() => {
    if (isOpen) {
      // Load rules data (this would need to be implemented in the API)
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleCreateRule = async () => {
    if (!newRuleName || selectedAccounts.length === 0 || !targetEntity) return;

    // This would need to be implemented in the API
    console.warn('EntityRule.create() not implemented in new API structure');
    
    // Reset form
    setNewRuleName("");
    setSelectedAccounts([]);
    setTargetEntity("");
  };
  
  const handleDeleteRule = async (ruleId) => {
    // This would need to be implemented in the API
    console.warn('EntityRule.delete() not implemented in new API structure');
  };

  const getAccountName = (accountId) => accounts.find(a => a.id === accountId)?.account_name || 'Unknown Account';
  const getEntityName = (entityId) => entities.find(e => e.id === entityId)?.name || 'Unknown Entity';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="w-5 h-5" />
            Manage Entity Assignment Rules
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Create Rule Form */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2"><PlusCircle className="w-5 h-5 text-emerald-600" /> Create a New Rule</h3>
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  placeholder="e.g., Assign Business Checking to MyCo"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label>If transaction is from...</Label>
                  <Popover open={openAccountSelector} onOpenChange={setOpenAccountSelector}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openAccountSelector} className="w-full justify-between">
                        {selectedAccounts.length > 0 ? `${selectedAccounts.length} account(s) selected` : "Select accounts..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search accounts..." />
                        <CommandList>
                          <CommandEmpty>No accounts found.</CommandEmpty>
                          <CommandGroup>
                            {accounts.map((account) => (
                              <CommandItem
                                key={account.id}
                                onSelect={() => {
                                  setSelectedAccounts(prev => 
                                    prev.find(a => a.id === account.id)
                                      ? prev.filter(a => a.id !== account.id)
                                      : [...prev, account]
                                  );
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", selectedAccounts.find(a => a.id === account.id) ? "opacity-100" : "opacity-0")} />
                                {account.account_name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Then assign to entity...</Label>
                  <Select value={targetEntity} onValueChange={setTargetEntity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCreateRule} disabled={!newRuleName || selectedAccounts.length === 0 || !targetEntity} className="bg-emerald-600 hover:bg-emerald-700">
                  Add Rule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Rules */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Active Rules</h3>
            {isLoading ? (
              <p>Loading rules...</p>
            ) : rules.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No rules created yet.</p>
            ) : (
              rules.map(rule => (
                <Card key={rule.id} className="bg-gray-50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{rule.name}</p>
                      <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-gray-400">FROM ACCOUNTS</span>
                          <div className="flex gap-1 flex-wrap">
                            {rule.source_account_ids.map(id => <Badge key={id} variant="secondary">{getAccountName(id)}</Badge>)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col items-start">
                           <span className="text-xs text-gray-400">TO ENTITY</span>
                           <Badge variant="outline" className="bg-white">{getEntityName(rule.target_entity_id)}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
