import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Store, DollarSign, List, CreditCard, Pencil, Tag, EyeOff, ClipboardCheck, Target, GitCommitHorizontal, PlusCircle, MinusCircle, Plus, ArrowRight,
  TrendingUp, Heart, Car, Home, Zap, UtensilsCrossed, MapPin, User, ShoppingBag, Shield, FileText, Briefcase, ArrowLeftRight, Search
} from 'lucide-react';
import { useTags, useRule, useGoals, useCategories } from "@/hooks/api";
import { ruleApi } from "@/api/client";

import AddCategoryModal from "../components/categories/AddCategoryModal";
import SuccessModal from "../components/rules/SuccessModal";
import CreateTagModal from "../components/rules/CreateTagModal";
import TagSelector from "../components/rules/TagSelector";
import SplitTransactionModal from "../components/rules/SplitTransactionModal";
import { payloadMapper, payloadActionMapper, payloadSplitMapper, decodeRuleData } from '@/utils/rulePayload';


const CriteriaBlock = ({ title, isEnabled, onToggle, children }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="flex items-center justify-between p-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <Switch checked={isEnabled} onCheckedChange={onToggle} />
    </div>
    {isEnabled && (
      <>
        <Separator />
        <div className="p-4 space-y-4">{children}</div>
      </>
    )}
  </div>
);

const ActionRow = ({ label, icon: Icon, isEnabled, onToggle, children }) => (
  <div className="space-y-3">
     <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
         <Icon className="w-5 h-5 text-gray-500" />
         <Label className="font-medium text-gray-800">{label}</Label>
       </div>
       <Switch checked={isEnabled} onCheckedChange={onToggle} />
     </div>
     {isEnabled && <div className="pl-8">{children}</div>}
  </div>
);


export default function RulesPage() {
  const { id: ruleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditing = Boolean(ruleId);
  
  // If editing, fetch the rule data
  const { rule: existingRule, isLoading: ruleLoading } = useRule(isEditing ? ruleId : null);
  
  const [rule, setRule] = useState({
    name: "New Rule",
    description: "",
    conditions: {
      merchants: { enabled: true, matchers: [[{ match_type: 'exactly_matches', value: '' }]] },
      amount: { enabled: true, transaction_type: 'expense', operator: 'greater_than', value1: 123, value2: null },
      categories: { enabled: true, values: [] },
      accounts: { enabled: false, values: [] },
      description: { enabled: false, match_type: 'contains', value: '' }, // <-- Add description condition
      date: { enabled: false, match_type: 'after', value1: '', value2: '' }, // <-- Add date condition
    },
    actions: {
      rename_merchant: { enabled: false, new_name: '' },
      update_category: { enabled: false, new_category: '' },
      add_tags: { enabled: false, tags: [] },
      hide_transaction: { enabled: false },
      mark_for_review: { enabled: false, review_status: 'needs_review', reviewer: '' },
      link_to_goal: { enabled: false, goal_id: '' },
      split_transaction: { enabled: false, splitType: 'amount', splits: [], hideOriginal: false }
    }
  });
  
  const [merchantNameError, setMerchantNameError] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedActionCategory, setSelectedActionCategory] = useState('');
  const [customCategories, setCustomCategories] = useState([]);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);

  // Use the hooks for tags, goals, and categories
  const { tags: allTags, createTag } = useTags();
  const { goals: allGoals } = useGoals();
  const { categories: allCategories, createCategory } = useCategories();

  // Load existing rule data when editing
  useEffect(() => {
    if (isEditing && existingRule && !ruleLoading) {
      try {
        const ruleData = JSON.parse(existingRule.rule_data || '{}');
        // Use the new decodeRuleData function to populate the form state
        const decoded = decodeRuleData(ruleData, allTags, allCategories);
        setRule({
          name: existingRule.name || "Rule",
          description: existingRule.description || "",
          ...decoded
        });
      } catch (error) {
        console.error('Error parsing existing rule data:', error);
      }
    }
  }, [isEditing, existingRule, ruleLoading, allTags, allCategories]);

  const handleToggle = (type, key) => {
    setRule(prev => {
      // If toggling split_transaction on, disable all other actions
      if (type === 'actions' && key === 'split_transaction' && !prev.actions.split_transaction.enabled) {
        return {
          ...prev,
          actions: {
            ...prev.actions,
            rename_merchant: { ...prev.actions.rename_merchant, enabled: false },
            update_category: { ...prev.actions.update_category, enabled: false },
            add_tags: { ...prev.actions.add_tags, enabled: false },
            hide_transaction: { ...prev.actions.hide_transaction, enabled: false },
            mark_for_review: { ...prev.actions.mark_for_review, enabled: false },
            link_to_goal: { ...prev.actions.link_to_goal, enabled: false },
            split_transaction: { ...prev.actions.split_transaction, enabled: true }
          }
        };
      }
      
      // If toggling any other action on while split_transaction is enabled, disable split_transaction
      if (type === 'actions' && key !== 'split_transaction' && prev.actions.split_transaction.enabled && !prev.actions[key].enabled) {
        return {
          ...prev,
          actions: {
            ...prev.actions,
            split_transaction: { ...prev.actions.split_transaction, enabled: false },
            [key]: { ...prev.actions[key], enabled: true }
          }
        };
      }
      
      // Normal toggle
      return {
        ...prev,
        [type]: {
          ...prev[type],
          [key]: { ...prev[type][key], enabled: !prev[type][key].enabled }
        }
      };
    });
  };

  const handleSaveRule = async () => {
    // Determine if this is a split rule or a regular rule
    const isSplitRule = rule.actions.split_transaction.enabled;
    
    let rule_data;
    if (isSplitRule) {
      // For split rules (rule_type 2)
      const splits = payloadSplitMapper(rule.actions.split_transaction, allTags, allCategories);
      rule_data = {
        ifs: payloadMapper(rule.conditions, allCategories),
        splits: splits || []
      };
    } else {
      // For regular rules (rule_type 1)
      rule_data = {
        ifs: payloadMapper(rule.conditions, allCategories),
        thens: payloadActionMapper(rule.actions, allTags, allCategories)
      };
    }

    const payload = {
      name: rule.name,
      description: rule.description,
      rule_type: isSplitRule ? 2 : 1,
      rule_data: JSON.stringify(rule_data)
    }

    try {
      const response = isEditing 
        ? await ruleApi.update(ruleId, {...payload,reapply_rule:1,id:ruleId})
        : await ruleApi.create(payload);
        
      if (response.status === 200 || response.status === 201) {
        setShowSuccessModal(true);
        // Navigate back to rules list after saving
        setTimeout(() => {
          navigate('/rules');
        }, 1500);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  }

  const handleMatcherChange = (groupIndex, matcherIndex, field, value) => {
    setRule(prev => {
      const newMatchers = JSON.parse(JSON.stringify(prev.conditions.merchants.matchers));
      newMatchers[groupIndex][matcherIndex][field] = value;
      return {
        ...prev,
        conditions: { ...prev.conditions, merchants: { ...prev.conditions.merchants, matchers: newMatchers } }
      };
    });
  };

  const handleAmountChange = (field, value) => {
    setRule(prev => {
      const newAmountState = { ...prev.conditions.amount, [field]: value };
      if (field === 'operator' && value !== 'between') {
        newAmountState.value2 = null;
      }
      return {
        ...prev,
        conditions: {
          ...prev.conditions,
          amount: newAmountState
        }
      };
    });
  };

  const addOrGroup = () => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        merchants: {
          ...prev.conditions.merchants,
          matchers: [...prev.conditions.merchants.matchers, [{ match_type: 'contains', value: '' }]]
        }
      }
    }));
  };

  const addAndMatcher = (groupIndex) => {
    setRule(prev => {
        const newMatchers = JSON.parse(JSON.stringify(prev.conditions.merchants.matchers));
        newMatchers[groupIndex].push({ match_type: 'contains', value: '' });
        return {
            ...prev,
            conditions: { ...prev.conditions, merchants: { ...prev.conditions.merchants, matchers: newMatchers } }
        };
    });
  };

  const removeMatcher = (groupIndex, matcherIndex) => {
    setRule(prev => {
      let newMatchers = JSON.parse(JSON.stringify(prev.conditions.merchants.matchers));
      newMatchers[groupIndex].splice(matcherIndex, 1);
      
      newMatchers = newMatchers.filter(group => group.length > 0);
      
      if (newMatchers.length === 0) {
        newMatchers.push([{ match_type: 'exactly_matches', value: '' }]);
      }
      return {
        ...prev,
        conditions: { ...prev.conditions, merchants: { ...prev.conditions.merchants, matchers: newMatchers } }
      };
    });
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await createCategory({
        name: categoryData.name,
        parent_category: categoryData.parent_category || null
      });
      
      const newCategoryName = newCategory.name;
      
      setSelectedCategory(newCategoryName);
      setSelectedActionCategory(newCategoryName);

      setRule(prevRule => {
        const newRule = { ...prevRule };
        if (newRule.conditions.categories.enabled) {
          newRule.conditions.categories = { ...newRule.conditions.categories, values: [newCategoryName] };
        }
        if (newRule.actions.update_category.enabled) {
          newRule.actions.update_category = { ...newRule.actions.update_category, new_category: newCategoryName };
        }
        return newRule;
      });

      setShowCreateCategoryModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  
  const handleCreateTag = async (tagData) => {
    try {
      const newTag = await createTag(tagData);
      
      setRule(prev => ({
        ...prev,
        actions: {
          ...prev.actions,
          add_tags: {
            ...prev.actions.add_tags,
            enabled: true,
            tags: [...prev.actions.add_tags.tags, newTag.name] // Store tag names for UI
          }
        }
      }));
      setShowCreateTagModal(false);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleReviewStatusChange = (field, value) => {
    setRule(prev => {
      const newMarkForReview = {
        ...prev.actions.mark_for_review,
        [field]: value
      };

      if (field === 'review_status' && value === 'reviewed') {
        newMarkForReview.reviewer = ''; // Clear reviewer when not needed
      }

      return {
        ...prev,
        actions: {
          ...prev.actions,
          mark_for_review: newMarkForReview
        }
      };
    });
  };

  const handleSplitSave = (splitData) => {
    setRule(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        split_transaction: {
          ...prev.actions.split_transaction,
          splitType: splitData.splitType,
          splits: splitData.splits,
          hideOriginal: splitData.hideOriginal
        }
      }
    }));
    setShowSplitModal(false);
  };

  // Add handler for Description condition
  const handleDescriptionChange = (field, value) => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        description: {
          ...prev.conditions.description,
          [field]: value
        }
      }
    }));
  };

  // Add handler for Date condition
  const handleDateChange = (field, value) => {
    setRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        date: {
          ...prev.conditions.date,
          [field]: value
        }
      }
    }));
  };

  // Transform API categories for the category selector
  const categoriesForSelector = allCategories.reduce((acc, category) => {
    // Group by parent category or use "Other" as default
    const groupName = category.parent_category || "Other";
    
    if (!acc[groupName]) {
      acc[groupName] = {
        icon: FileText, // Default icon
        subcategories: []
      };
    }
    
    acc[groupName].subcategories.push(category.name);
    return acc;
  }, {});

  const accounts = ["Checking", "Savings", "Credit Card"];
  const reviewers = ["John Smith", "Sarah Johnson", "Mike Wilson", "Emma Davis"];

  // Show loading state when editing and rule is loading
  if (isEditing && ruleLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rule...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredCategories = Object.entries(categoriesForSelector).reduce((acc, [category, { icon, emoji, subcategories }]) => {
    if (!categorySearch) {
      acc[category] = { icon, emoji, subcategories };
      return acc;
    }

    const lowerCaseSearch = categorySearch.toLowerCase();
    const categoryMatches = category.toLowerCase().includes(lowerCaseSearch);
    const matchingSubcategories = subcategories.filter(sub => 
      sub.toLowerCase().includes(lowerCaseSearch)
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
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50">
       <style>{`
          .switch-orange[data-state='checked'] { background-color: #f97316; }
          .category-header { font-weight: 600; color: #374151; padding: 8px 12px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb; }
          .subcategory-item { padding-left: 24px; display: flex; align-items: center; gap: 8px; }
          .subcategory-item::before { content: "•"; color: #9ca3af; font-weight: bold; width: 8px; }
          .category-search { position: sticky; top: 0; z-index: 10; background: white; padding: 8px; border-bottom: 1px solid #e5e7eb; margin: -8px -8px 8px -8px; }
          .add-category-button { position: sticky; bottom: 0; z-index: 10; background: white; padding: 8px; border-top: 1px solid #e5e7eb; margin: 8px -8px -8px -8px; }
          .data-[state=checked] { --color-primary: #16a34a; }
          .data-[state=checked] { background-color: var(--color-primary) !important; border-color: var(--color-primary) !important; color: white; }
        `}</style>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Rule' : 'Create Rule'}
        </h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <Input 
          className="text-lg font-semibold border-gray-300" 
          placeholder="Enter Rule Name"
          value={rule.name}
          onChange={(e) => setRule({...rule, name: e.target.value})}
        />
        <Textarea 
          placeholder="Description (optional)"
          value={rule.description}
          onChange={(e) => setRule({...rule, description: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">If a transaction matches...</h2>
          <div className="space-y-4">
            <CriteriaBlock title="Merchants" isEnabled={rule.conditions.merchants.enabled} onToggle={() => handleToggle('conditions', 'merchants')}>
              <Select defaultValue="merchant_name">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="merchant_name">Merchant Name</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-4">
                {rule.conditions.merchants.matchers.map((group, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    {groupIndex > 0 && <p className="text-sm font-semibold text-gray-600 text-center py-2">OR</p>}
                    <div className="p-4 border rounded-md bg-gray-50 space-y-3">
                      {group.map((matcher, matcherIndex) => (
                        <div key={matcherIndex} className="space-y-2">
                          {matcherIndex > 0 && <p className="text-xs font-semibold text-gray-500 pl-1">AND</p>}
                          <div className="flex items-center gap-2">
                            <Select 
                              value={matcher.match_type} 
                              onValueChange={(value) => handleMatcherChange(groupIndex, matcherIndex, 'match_type', value)}
                            >
                              <SelectTrigger className="w-[180px] flex-shrink-0"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="exactly_matches">Exactly matches</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="starts_with">Starts with</SelectItem>
                                <SelectItem value="ends_with">Ends with</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex-grow relative">
                              <Input 
                                placeholder="Name" 
                                value={matcher.value}
                                onChange={(e) => handleMatcherChange(groupIndex, matcherIndex, 'value', e.target.value)}
                                className={groupIndex === 0 && matcherIndex === 0 && merchantNameError ? 'border-red-500' : ''}
                              />
                            </div>
                            {(matcherIndex > 0 || (groupIndex > 0 && group.length === 1)) ? (
                              <button onClick={() => removeMatcher(groupIndex, matcherIndex)} title="Remove condition">
                                <MinusCircle className="w-5 h-5 text-gray-400 hover:text-red-500" />
                              </button>
                            ) : (
                              <div className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-start gap-4 pt-2 border-t border-gray-200">
                        <button
                          onClick={() => addAndMatcher(groupIndex)}
                          className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-medium hover:bg-emerald-200 px-3 py-1 rounded-md transition-colors text-sm"
                          title="Add AND condition"
                        >
                          <Plus className="w-4 h-4" />
                          <span>AND</span>
                        </button>
                        {groupIndex === rule.conditions.merchants.matchers.length - 1 && (
                          <button
                            onClick={addOrGroup}
                            className="flex items-center gap-1.5 bg-blue-100 text-blue-800 font-medium hover:bg-blue-200 px-3 py-1 rounded-md transition-colors text-sm"
                            title="Add OR condition"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>OR</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CriteriaBlock>

            <CriteriaBlock title="Amount" isEnabled={rule.conditions.amount.enabled} onToggle={() => handleToggle('conditions', 'amount')}>
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  value={rule.conditions.amount.transaction_type}
                  onValueChange={(value) => handleAmountChange('transaction_type', value)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
                 <Select 
                   value={rule.conditions.amount.operator}
                   onValueChange={(value) => handleAmountChange('operator', value)}
                 >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater_than">Greater than</SelectItem>
                    <SelectItem value="less_than">Less than</SelectItem>
                    <SelectItem value="equal_to">Equal to</SelectItem>
                    <SelectItem value="between">Between</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {rule.conditions.amount.operator === 'between' ? (
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      value={rule.conditions.amount.value1 || ''} 
                      onChange={(e) => handleAmountChange('value1', e.target.value)} 
                      className="pl-6" 
                    />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      value={rule.conditions.amount.value2 || ''}
                      onChange={(e) => handleAmountChange('value2', e.target.value)} 
                      className="pl-6" 
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input 
                    type="number" 
                    placeholder="123" 
                    value={rule.conditions.amount.value1 || ''} 
                    onChange={(e) => handleAmountChange('value1', e.target.value)} 
                    className="pl-6" 
                  />
                </div>
              )}
            </CriteriaBlock>

            <CriteriaBlock title="Categories" isEnabled={rule.conditions.categories.enabled} onToggle={() => handleToggle('conditions', 'categories')}>
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setRule(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, categories: { ...prev.conditions.categories, values: [value] }}
                  }));
                }}
              >
                <SelectTrigger><SelectValue placeholder="Category equals..." /></SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="category-search">
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
                          {emoji ? <span className="text-xl leading-none">{emoji}</span> : CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                          {category}
                        </SelectLabel>
                        {subcategories.map(subcategory => (
                          <SelectItem key={subcategory} value={subcategory} className="subcategory-item">
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                    
                    {Object.keys(filteredCategories).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No categories found
                      </div>
                    )}
                  </div>
                  
                  <div className="add-category-button">
                    <Button 
                      variant="outline" 
                      className="w-full h-8 text-sm gap-2"
                      onClick={() => setShowCreateCategoryModal(true)}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Plus className="w-3 h-3" />
                      Add New Category
                    </Button>
                  </div>
                </SelectContent>
              </Select>
            </CriteriaBlock>
            
            <CriteriaBlock title="Accounts" isEnabled={rule.conditions.accounts.enabled} onToggle={() => handleToggle('conditions', 'accounts')}>
              <Select>
                <SelectTrigger><SelectValue placeholder="Account equals..." /></SelectTrigger>
                <SelectContent>
                  {accounts.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </CriteriaBlock>

            <CriteriaBlock title="Description" isEnabled={rule.conditions.description.enabled} onToggle={() => handleToggle('conditions', 'description')}>
              <div className="flex gap-3 items-center">
                <Select
                  value={rule.conditions.description.match_type}
                  onValueChange={value => handleDescriptionChange('match_type', value)}
                >
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="exact">Exact</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Description..."
                  value={rule.conditions.description.value}
                  onChange={e => handleDescriptionChange('value', e.target.value)}
                />
              </div>
            </CriteriaBlock>

            <CriteriaBlock title="Date" isEnabled={rule.conditions.date.enabled} onToggle={() => handleToggle('conditions', 'date')}>
              <div className="flex gap-3 items-center">
                <Select
                  value={rule.conditions.date.match_type}
                  onValueChange={value => handleDateChange('match_type', value)}
                >
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="after">After</SelectItem>
                    <SelectItem value="before">Before</SelectItem>
                    <SelectItem value="on">On</SelectItem>
                    <SelectItem value="between">Between</SelectItem>
                  </SelectContent>
                </Select>
                {rule.conditions.date.match_type === 'between' ? (
                  <>
                    <Input
                      type="date"
                      value={rule.conditions.date.value1}
                      onChange={e => handleDateChange('value1', e.target.value)}
                      className="w-[140px]"
                    />
                    <span className="mx-1">to</span>
                    <Input
                      type="date"
                      value={rule.conditions.date.value2}
                      onChange={e => handleDateChange('value2', e.target.value)}
                      className="w-[140px]"
                    />
                  </>
                ) : (
                  <Input
                    type="date"
                    value={rule.conditions.date.value1}
                    onChange={e => handleDateChange('value1', e.target.value)}
                    className="w-[140px]"
                  />
                )}
              </div>
            </CriteriaBlock>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-800">
            {rule.actions.split_transaction.enabled ? "Then split the transaction..." : "Then apply these updates..."}
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            {!rule.actions.split_transaction.enabled && (
              <>
                <ActionRow label="Rename merchant" icon={Pencil} isEnabled={rule.actions.rename_merchant.enabled} onToggle={() => handleToggle('actions', 'rename_merchant')}>
                  <Input 
                    placeholder="New merchant name" 
                    value={rule.actions.rename_merchant.new_name}
                    onChange={(e) => setRule(prev => ({
                      ...prev,
                      actions: { ...prev.actions, rename_merchant: { ...prev.actions.rename_merchant, new_name: e.target.value }}
                    }))}
                  />
                </ActionRow>
                <Separator />
                <ActionRow label="Update category" icon={List} isEnabled={rule.actions.update_category.enabled} onToggle={() => handleToggle('actions', 'update_category')}>
                  <Select 
                    value={selectedActionCategory} 
                    onValueChange={(value) => {
                      setSelectedActionCategory(value);
                      setRule(prev => ({
                        ...prev,
                        actions: { ...prev.actions, update_category: { ...prev.actions.update_category, new_category: value }}
                      }));
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent className="max-h-80">
                      <div className="category-search">
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
                              {emoji ? <span className="text-xl leading-none">{emoji}</span> : CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                              {category}
                            </SelectLabel>
                            {subcategories.map(subcategory => (
                              <SelectItem key={subcategory} value={subcategory} className="subcategory-item">
                                {subcategory}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                        
                        {Object.keys(filteredCategories).length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No categories found
                          </div>
                        )}
                      </div>
                      
                      <div className="add-category-button">
                        <Button 
                          variant="outline" 
                          className="w-full h-8 text-sm gap-2"
                          onClick={() => setShowCreateCategoryModal(true)}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Plus className="w-3 h-3" />
                          Add New Category
                        </Button>
                      </div>
                    </SelectContent>
                  </Select>
                </ActionRow>
                <Separator />
                <ActionRow label="Add tags" icon={Tag} isEnabled={rule.actions.add_tags.enabled} onToggle={() => handleToggle('actions', 'add_tags')}>
                   <TagSelector
                     allTags={allTags}
                     selectedTags={rule.actions.add_tags.tags}
                     onTagsChange={(newTags) => {
                       setRule(prev => ({
                         ...prev,
                         actions: {
                           ...prev.actions,
                           add_tags: { ...prev.actions.add_tags, tags: newTags }
                         }
                       }));
                     }}
                     onCreateNew={() => setShowCreateTagModal(true)}
                   />
                </ActionRow>
                <Separator />
                <ActionRow label="Hide transaction" icon={EyeOff} isEnabled={rule.actions.hide_transaction.enabled} onToggle={() => handleToggle('actions', 'hide_transaction')} />
                <Separator />
                <ActionRow label="Review status" icon={ClipboardCheck} isEnabled={rule.actions.mark_for_review.enabled} onToggle={() => handleToggle('actions', 'mark_for_review')}>
                  <div className="space-y-3">
                    <Select 
                      value={rule.actions.mark_for_review.review_status}
                      onValueChange={(value) => handleReviewStatusChange('review_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="needs_review">Needs review</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {rule.actions.mark_for_review.review_status === 'needs_review' && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Assign To</Label>
                        <Select 
                          value={rule.actions.mark_for_review.reviewer}
                          onValueChange={(value) => handleReviewStatusChange('reviewer', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer" />
                          </SelectTrigger>
                          <SelectContent>
                            {reviewers.map(reviewer => (
                              <SelectItem key={reviewer} value={reviewer}>
                                {reviewer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </ActionRow>
                <Separator />
                 <ActionRow label="Link to goal" icon={Target} isEnabled={rule.actions.link_to_goal.enabled} onToggle={() => handleToggle('actions', 'link_to_goal')}>
                   <Select
                     value={rule.actions.link_to_goal.goal_id}
                     onValueChange={(value) => setRule(prev => ({
                       ...prev,
                       actions: { ...prev.actions, link_to_goal: { ...prev.actions.link_to_goal, goal_id: value }}
                     }))}
                   >
                     <SelectTrigger><SelectValue placeholder="Select a goal" /></SelectTrigger>
                     <SelectContent>
                       {allGoals && allGoals.length > 0 ? (
                         allGoals.map(goal => (
                           <SelectItem key={goal.id} value={goal.id}>
                             {goal.name}
                           </SelectItem>
                         ))
                       ) : (
                         <div className="p-2 text-sm text-gray-500 text-center">
                           No goals available
                         </div>
                       )}
                     </SelectContent>
                   </Select>
                </ActionRow>
                <Separator />
              </>
            )}
          </div>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-4 text-gray-500 font-semibold">OR</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

          {/* OR separator and Split transaction option in a separate card */}
          <div className="mt-8" />
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <ActionRow label="Split transaction" icon={GitCommitHorizontal} isEnabled={rule.actions.split_transaction.enabled} onToggle={() => handleToggle('actions', 'split_transaction')}>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {rule.actions.split_transaction.splits.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Split Configuration:</span>
                        <Badge variant="outline">
                          {rule.actions.split_transaction.splits.length} split{rule.actions.split_transaction.splits.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        Type: <span className="capitalize">{rule.actions.split_transaction.splitType}</span>
                        {rule.actions.split_transaction.hideOriginal && (
                          <span className="ml-2">• Hide original</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No split configuration set
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSplitModal(true)}
                  className="w-full gap-2"
                >
                  <GitCommitHorizontal className="w-4 h-4" />
                  {rule.actions.split_transaction.splits.length > 0 ? 'Edit Split Configuration' : 'Configure Split'}
                </Button>
              </div>
            </ActionRow>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => navigate('/rules')}>Cancel</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveRule}>
          {isEditing ? 'Update Rule' : 'Save Rule'}
        </Button>
      </div>

      <AddCategoryModal
        isOpen={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSave={handleCreateCategory}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={isEditing ? "Rule updated successfully!" : "Rule created successfully!"}
      />

      <CreateTagModal
        isOpen={showCreateTagModal}
        onClose={() => setShowCreateTagModal(false)}
        onSave={handleCreateTag}
      />

      <SplitTransactionModal
        isOpen={showSplitModal}
        onClose={() => setShowSplitModal(false)}
        onSave={handleSplitSave}
        allTags={allTags}
        splits={rule.actions.split_transaction.splits}
        splitType={rule.actions.split_transaction.splitType}
        hideOriginal={rule.actions.split_transaction.hideOriginal}
        allCategories={categoriesForSelector}
        onCreateCategory={() => setShowCreateCategoryModal(true)}
      />
    </div>
  );
}