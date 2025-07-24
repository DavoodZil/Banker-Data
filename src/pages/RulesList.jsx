import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  Search, Edit3, Trash2, Plus, Eye, EyeOff, Play, Settings,
  Store, DollarSign, List, CreditCard, Tag, ClipboardCheck, Target, GitCommitHorizontal
} from 'lucide-react';
import { useRules } from "@/hooks/api";
import { useNavigate } from 'react-router-dom';

const RuleCard = ({ rule, onEdit, onDelete, onApply }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Parse rule data
  let ruleData = {};
  try {
    ruleData = JSON.parse(rule.rule_data || '{}');
  } catch (error) {
    console.error('Error parsing rule data:', error);
  }

  const conditions = ruleData.ifs || [];
  const actions = ruleData.thens || [];

  const getConditionIcon = (type) => {
    const iconMap = {
      'merchant': Store,
      'amount': DollarSign,
      'category': List,
      'account': CreditCard,
      'description': Eye,
      'date': ClipboardCheck
    };
    return iconMap[type] || Settings;
  };

  const getActionIcon = (type) => {
    const iconMap = {
      'rename_merchant': Edit3,
      'update_category': List,
      'add_tags': Tag,
      'hide_transaction': EyeOff,
      'mark_for_review': ClipboardCheck,
      'link_to_goal': Target,
      'split_transaction': GitCommitHorizontal
    };
    return iconMap[type] || Settings;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(rule.id);
    } catch (error) {
      console.error('Error deleting rule:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApply = async () => {
    try {
      await onApply(rule.id);
    } catch (error) {
      console.error('Error applying rule:', error);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {rule.name}
            </CardTitle>
            {rule.description && (
              <p className="text-sm text-gray-600">{rule.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(rule)}
              className="h-8 px-2"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleApply}
              className="h-8 px-2 text-emerald-600 hover:text-emerald-700"
            >
              <Play className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{rule.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Rule Type */}
          <div>
            <Badge variant={rule.rule_type === 1 ? "default" : "secondary"}>
              {rule.rule_type === 1 ? "Standard Rule" : rule.rule_type === 2 ? "Split Rule" : `Type ${rule.rule_type}`}
            </Badge>
          </div>

          {/* Basic Rule Info */}
          {(conditions.length > 0 || actions.length > 0) && (
            <div className="text-sm text-gray-600">
              {conditions.length > 0 && <span>{conditions.length} condition{conditions.length !== 1 ? 's' : ''}</span>}
              {conditions.length > 0 && actions.length > 0 && <span> • </span>}
              {actions.length > 0 && <span>{actions.length} action{actions.length !== 1 ? 's' : ''}</span>}
            </div>
          )}

          {conditions.length === 0 && actions.length === 0 && (
            <p className="text-sm text-gray-500">No rule configuration found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function RulesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { rules, isLoading, error, deleteRule, applyRule, refetch } = useRules();
  const navigate = useNavigate();


  const filteredRules = Array.isArray(rules) 
    ? rules.filter(rule => 
        rule?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rule?.description && rule.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleEdit = (rule) => {
    // Navigate to edit page with rule data
    navigate(`/rules/edit/${rule.id}`, { state: { rule } });
  };

  const handleDelete = async (ruleId) => {
    await deleteRule(ruleId);
    refetch();
  };

  const handleApply = async (ruleId) => {
    await applyRule(ruleId);
    // Could show a toast notification here
  };

  const handleApplyAll = async () => {
    // This would apply all rules
    // Implementation depends on your API
  };

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading rules: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rules</h1>
          <p className="text-gray-600 mt-1">Manage your transaction rules</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleApplyAll}
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Apply All Rules
          </Button>
          <Button
            onClick={() => navigate('/rules')}
            className="bg-emerald-600 hover:bg-emerald-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredRules.length} of {rules?.length || 0} rules
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No rules found' : 'No rules created yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first rule to automatically organize your transactions'
              }
            </p>
            {!searchQuery && (
              <Button
                onClick={() => navigate('/rules')}
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Rule
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}