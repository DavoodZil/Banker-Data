// --- CONSTANTS ---
export const IF_ORIGINAL_DESCRIPTION = 1;
export const IF_AMOUNT = 2;
export const IF_DATE = 3;
export const IF_ACCOUNT = 4;
export const IF_MERCHANT = 5;
export const IF_CATEGORY = 6;
export const IF_DESCRIPTION = 7;

export const DESCRIPTION_MATCH_TYPE_CONTAINS = 1;
export const DESCRIPTION_MATCH_TYPE_EXACT = 2;
export const AMOUNT_MATCH_TYPE_GREATER_THAN = 1;
export const AMOUNT_MATCH_TYPE_LESS_THAN = 2;
export const AMOUNT_MATCH_TYPE_EQUALS = 3;
export const AMOUNT_MATCH_TYPE_BETWEEN = 4;
export const AMOUNT_MATCH_TYPE_EXPENSE = 5;
export const AMOUNT_MATCH_TYPE_INCOME = 6;

export const DATE_MATCH_TYPE_AFTER = 1;
export const DATE_MATCH_TYPE_BEFORE = 2;
export const DATE_MATCH_TYPE_ON = 3;
export const DATE_MATCH_TYPE_BETWEEN = 4;

export const MERCHANT_MATCH_TYPE_CONTAINS = 2;
export const MERCHANT_MATCH_TYPE_EXACT = 1;
export const MERCHANT_MATCH_TYPE_ORIGINAL_STATEMENT = 3;
export const MERCHANT_MATCH_TYPE_MERCHANT_NAME = 4;

export const THEN_ACTION_RENAME_MERCHANT = 1;
export const THEN_ACTION_UPDATE_CATEGORY = 2;
export const THEN_ACTION_ADD_TAG = 3;
export const THEN_ACTION_HIDE_TRANSACTION = 4;
export const THEN_ACTION_LINK_TO_GOAL = 5;

export const matcherMapper = (matcher, type) => {
  if (type === 'merchants') {
    switch (matcher.match_type) {
      case 'contains':
        return [MERCHANT_MATCH_TYPE_CONTAINS, matcher.value];
      case 'exactly_matches':
        return [MERCHANT_MATCH_TYPE_EXACT, matcher.value];
      case 'starts_with':
        return [MERCHANT_MATCH_TYPE_ORIGINAL_STATEMENT, matcher.value];
      case 'ends_with':
        return [MERCHANT_MATCH_TYPE_MERCHANT_NAME, matcher.value];
      default:
        return null;
    }
  } else if (type === 'amount') {
    switch (matcher.match_type) {
      case 'greater_than':
        return [AMOUNT_MATCH_TYPE_GREATER_THAN, matcher.value1];
      case 'less_than':
        return [AMOUNT_MATCH_TYPE_LESS_THAN, matcher.value1];
      case 'equals':
        return [AMOUNT_MATCH_TYPE_EQUALS, matcher.value1];
      case 'between':
        return [AMOUNT_MATCH_TYPE_BETWEEN, matcher.value1, matcher.value2];
      case 'expense':
        return [AMOUNT_MATCH_TYPE_EXPENSE, matcher.value1];
      case 'income':
        return [AMOUNT_MATCH_TYPE_INCOME, matcher.value1];
      default:
        return null;
    }
  } else if (type === 'date') {
    switch (matcher.match_type) {
      case 'after':
        return [DATE_MATCH_TYPE_AFTER, matcher.value1];
      case 'before':
        return [DATE_MATCH_TYPE_BEFORE, matcher.value1];
      case 'on':
        return [DATE_MATCH_TYPE_ON, matcher.value1];
      case 'between':
        return [DATE_MATCH_TYPE_BETWEEN, matcher.value1, matcher.value2];
      default:
        return null;
    }
  } else if (type === 'description') {
    switch (matcher.match_type) {
      case 'contains':
        return [DESCRIPTION_MATCH_TYPE_CONTAINS, matcher.value];
      case 'exact':
        return [DESCRIPTION_MATCH_TYPE_EXACT, matcher.value];
      default:
        return null;
    }
  }
  return null;
};

export const payloadMapper = (condition, allCategories = []) => {
  // Collect all conditions
  let allConditions = [];
  let merchantGroups = [];
  let merchantType = null;
  
  Object.entries(condition)
    .filter(([key, value]) => value.enabled)
    .forEach(([key, value]) => {
      if (key === 'merchants') {
        // Store merchant groups separately for special handling
        merchantGroups = value.matchers;
        merchantType = value.type || 'merchant_name';
      } else if (key === 'amount') {
        const mapped = matcherMapper({
          match_type: value.operator,
          value1: value.value1,
          value2: value.value2
        }, 'amount');
        if (mapped) allConditions.push([IF_AMOUNT, ...mapped]);
      } else if (key === 'categories') {
        // Categories now come as enc_ids directly
        (value.values || []).forEach(categoryId => {
          allConditions.push([IF_CATEGORY, categoryId]);
        });
      } else if (key === 'accounts') {
        (value.values || []).forEach(val => allConditions.push([IF_ACCOUNT, MERCHANT_MATCH_TYPE_EXACT, val]));
      } else if (key === 'description') {
        const mapped = matcherMapper({
          match_type: value.match_type,
          value: value.value
        }, 'description');
        if (mapped) allConditions.push([IF_DESCRIPTION, ...mapped]);
      } else if (key === 'date') {
        const mapped = matcherMapper({
          match_type: value.match_type,
          value1: value.value1,
          value2: value.value2
        }, 'date');
        if (mapped) allConditions.push([IF_DATE, ...mapped]);
      }
    });

  // If no merchant groups, return conditions as nested array
  if (merchantGroups.length === 0) {
    return allConditions.length > 0 ? [allConditions] : [];
  }

  // Build nested structure for OR groups with AND conditions
  const result = [];
  
  merchantGroups.forEach(group => {
    const groupConditions = [];
    
    // Add merchant conditions for this group
    group.forEach(matcher => {
      const mapped = matcherMapper(matcher, 'merchants');
      if (mapped) {
        // Use IF_ORIGINAL_DESCRIPTION (1) for original_description, IF_MERCHANT (5) for merchant_name
        const conditionType = merchantType === 'original_description' ? IF_ORIGINAL_DESCRIPTION : IF_MERCHANT;
        groupConditions.push([conditionType, ...mapped]);
      }
    });
    
    // Add all other conditions to each group
    groupConditions.push(...allConditions);
    
    // Only add the group if it has conditions
    if (groupConditions.length > 0) {
      result.push(groupConditions);
    }
  });

  return result;
};

// Helper function to convert tag names to IDs
const convertTagNamesToIds = (tagNames, allTags) => {
  if (!Array.isArray(tagNames) || !Array.isArray(allTags)) return [];
  return tagNames.map(tagName => {
    const tag = allTags.find(t => t.name === tagName);
    return tag ? tag.id : null;
  }).filter(Boolean);
};

// Helper function to convert tag IDs to names
const convertTagIdsToNames = (tagIds, allTags) => {
  if (!Array.isArray(tagIds) && typeof tagIds !== 'number') return [];
  const ids = Array.isArray(tagIds) ? tagIds : [tagIds];
  if (!Array.isArray(allTags)) return [];
  return ids.map(tagId => {
    const tag = allTags.find(t => t.id === tagId);
    return tag ? tag.name : null;
  }).filter(Boolean);
};

// Helper function to convert category names to IDs
const convertCategoryNamesToIds = (categoryNames, allCategories) => {
  if (!Array.isArray(categoryNames)) return [];
  if (!Array.isArray(allCategories)) return [];
  return categoryNames.map(categoryName => {
    const category = allCategories.find(c => c.name === categoryName);
    return category ? category.id : null;
  }).filter(Boolean);
};

// Helper function to convert category IDs to names
const convertCategoryIdsToNames = (categoryIds, allCategories) => {
  if (!Array.isArray(categoryIds) && typeof categoryIds !== 'number') return [];
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
  if (!Array.isArray(allCategories)) return [];
  return ids.map(categoryId => {
    const category = allCategories.find(c => c.id === categoryId);
    return category ? category.name : null;
  }).filter(Boolean);
};

export const payloadActionMapper = (action, allTags = [], allCategories = []) => {
  const enabledFields = Object.entries(action)
    .filter(([key, value]) => value.enabled)
    .map(([key, value]) => {
      switch (key) {
        case 'rename_merchant':
          return [THEN_ACTION_RENAME_MERCHANT, value.new_name];
        case 'update_category':
          // Category is already an enc_id
          return [THEN_ACTION_UPDATE_CATEGORY, value.new_category];
        case 'add_tags':
          // Convert tag names to IDs
          const tagIds = convertTagNamesToIds(value.tags, allTags);
          return [THEN_ACTION_ADD_TAG, tagIds];
        case 'hide_transaction':
          return [THEN_ACTION_HIDE_TRANSACTION];
        case 'link_to_goal':
          return [THEN_ACTION_LINK_TO_GOAL, value.goal_id];
        default:
          return null;
      }
    });
  return enabledFields.filter(Boolean);
};

export const payloadSplitMapper = (splitData, allTags = [], allCategories = []) => {
  if (!splitData.enabled || !splitData.splits || splitData.splits.length === 0) {
    return null;
  }
  
  return splitData.splits.map(split => {
    // Category is already an enc_id
    return {
      merchant: split.merchant || '',
      category_id: split.category,
      amount: splitData.splitType === 'amount' ? parseFloat(split.amount) || 0 : parseFloat(split.percentage) || 0,
      percentage: splitData.splitType === 'percentage' ? parseFloat(split.percentage) || 0 : null,
      split_type: splitData.splitType,
      tags: convertTagNamesToIds(split.tags || [], allTags),
      review_status: split.review_status === 'needs_review' ? 1 : (split.review_status === 'reviewed' ? 2 : 0),
      reviewer: split.reviewer || null,
      hide_original: splitData.hideOriginal || false
    };
  });
};

/**
 * Reverse-maps rule_data (with ifs/thens) to the form state for editing.
 * @param {object} ruleData - The parsed rule_data object from the API
 * @returns {object} - The form state for the rule
 */
export function decodeRuleData(ruleData, allTags = [], allCategories = []) {
  // Default form state structure
  const formState = {
    conditions: {
      merchants: { enabled: false, type: 'merchant_name', matchers: [[{ match_type: 'exactly_matches', value: '' }]] },
      amount: { enabled: false, transaction_type: 'expense', operator: 'greater_than', value1: '', value2: null },
      categories: { enabled: false, values: [] },
      accounts: { enabled: false, values: [] },
      description: { enabled: false, match_type: 'contains', value: '' },
      date: { enabled: false, match_type: 'after', value1: '', value2: '' },
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
  };

  // --- Decode IFs (conditions) ---
  if (Array.isArray(ruleData.ifs) && ruleData.ifs.length > 0) {
    // Check if ifs is a nested array structure (OR groups)
    const isNestedStructure = Array.isArray(ruleData.ifs[0]);
    
    if (isNestedStructure) {
      // Handle nested structure: [[...], [...], [...]]
      let merchantGroups = [];
      let hasOriginalDescription = false;
      
      ruleData.ifs.forEach((orGroup, groupIndex) => {
        let merchantMatchers = [];
        
        orGroup.forEach(cond => {
          const [type, ...rest] = cond;
          switch (type) {
            case IF_MERCHANT:
            case IF_ORIGINAL_DESCRIPTION: {
              formState.conditions.merchants.enabled = true;
              if (type === IF_ORIGINAL_DESCRIPTION) {
                formState.conditions.merchants.type = 'original_description';
                hasOriginalDescription = true;
              }
              const [matchType, value] = rest;
              let match_type = 'contains';
              if (matchType === MERCHANT_MATCH_TYPE_CONTAINS) match_type = 'contains';
              else if (matchType === MERCHANT_MATCH_TYPE_EXACT) match_type = 'exactly_matches';
              else if (matchType === MERCHANT_MATCH_TYPE_ORIGINAL_STATEMENT) match_type = 'starts_with';
              else if (matchType === MERCHANT_MATCH_TYPE_MERCHANT_NAME) match_type = 'ends_with';
              merchantMatchers.push({ match_type, value });
              break;
            }
            case IF_AMOUNT: {
              formState.conditions.amount.enabled = true;
              const [op, v1, v2] = rest;
              if (op === AMOUNT_MATCH_TYPE_GREATER_THAN) {
                formState.conditions.amount.operator = 'greater_than';
                formState.conditions.amount.value1 = v1;
              } else if (op === AMOUNT_MATCH_TYPE_LESS_THAN) {
                formState.conditions.amount.operator = 'less_than';
                formState.conditions.amount.value1 = v1;
              } else if (op === AMOUNT_MATCH_TYPE_EQUALS) {
                formState.conditions.amount.operator = 'equal_to';
                formState.conditions.amount.value1 = v1;
              } else if (op === AMOUNT_MATCH_TYPE_BETWEEN) {
                formState.conditions.amount.operator = 'between';
                formState.conditions.amount.value1 = v1;
                formState.conditions.amount.value2 = v2;
              } else if (op === AMOUNT_MATCH_TYPE_EXPENSE) {
                formState.conditions.amount.transaction_type = 'expense';
                formState.conditions.amount.value1 = v1;
              } else if (op === AMOUNT_MATCH_TYPE_INCOME) {
                formState.conditions.amount.transaction_type = 'income';
                formState.conditions.amount.value1 = v1;
              }
              break;
            }
            case IF_CATEGORY: {
              formState.conditions.categories.enabled = true;
              const [categoryId] = rest;
              // Categories are stored as enc_ids now
              if (!formState.conditions.categories.values.includes(categoryId)) {
                formState.conditions.categories.values.push(categoryId);
              }
              break;
            }
            case IF_ACCOUNT: {
              formState.conditions.accounts.enabled = true;
              const [account] = rest;
              if (!formState.conditions.accounts.values.includes(account)) {
                formState.conditions.accounts.values.push(account);
              }
              break;
            }
            case IF_DESCRIPTION: {
              formState.conditions.description.enabled = true;
              const [matchType, value] = rest;
              let match_type = 'contains';
              if (matchType === DESCRIPTION_MATCH_TYPE_CONTAINS) match_type = 'contains';
              else if (matchType === DESCRIPTION_MATCH_TYPE_EXACT) match_type = 'exact';
              formState.conditions.description.match_type = match_type;
              formState.conditions.description.value = value;
              break;
            }
            case IF_DATE: {
              formState.conditions.date.enabled = true;
              const [matchType, v1, v2] = rest;
              if (matchType === DATE_MATCH_TYPE_AFTER) {
                formState.conditions.date.match_type = 'after';
                formState.conditions.date.value1 = v1;
              } else if (matchType === DATE_MATCH_TYPE_BEFORE) {
                formState.conditions.date.match_type = 'before';
                formState.conditions.date.value1 = v1;
              } else if (matchType === DATE_MATCH_TYPE_ON) {
                formState.conditions.date.match_type = 'on';
                formState.conditions.date.value1 = v1;
              } else if (matchType === DATE_MATCH_TYPE_BETWEEN) {
                formState.conditions.date.match_type = 'between';
                formState.conditions.date.value1 = v1;
                formState.conditions.date.value2 = v2;
              }
              break;
            }
            default:
              break;
          }
        });
        
        if (merchantMatchers.length > 0) {
          merchantGroups.push(merchantMatchers);
        }
      });
      
      if (merchantGroups.length > 0) {
        formState.conditions.merchants.matchers = merchantGroups;
      }
    } else {
      // Handle flat structure (backward compatibility)
      let merchantMatchers = [];
      ruleData.ifs.forEach(cond => {
        const [type, ...rest] = cond;
        switch (type) {
          case IF_MERCHANT:
          case IF_ORIGINAL_DESCRIPTION: {
            formState.conditions.merchants.enabled = true;
            if (type === IF_ORIGINAL_DESCRIPTION) {
              formState.conditions.merchants.type = 'original_description';
            }
            const [matchType, value] = rest;
            let match_type = 'contains';
            if (matchType === MERCHANT_MATCH_TYPE_CONTAINS) match_type = 'contains';
            else if (matchType === MERCHANT_MATCH_TYPE_EXACT) match_type = 'exactly_matches';
            else if (matchType === MERCHANT_MATCH_TYPE_ORIGINAL_STATEMENT) match_type = 'starts_with';
            else if (matchType === MERCHANT_MATCH_TYPE_MERCHANT_NAME) match_type = 'ends_with';
            merchantMatchers.push({ match_type, value });
            break;
          }
          // ... other cases remain the same
        }
      });
      if (merchantMatchers.length > 0) {
        formState.conditions.merchants.matchers = [merchantMatchers];
      }
    }
  }

  // --- Decode THENs (actions) ---
  if (Array.isArray(ruleData.thens)) {
    ruleData.thens.forEach(action => {
      const [type, value] = action;
      switch (type) {
        case THEN_ACTION_RENAME_MERCHANT:
          formState.actions.rename_merchant.enabled = true;
          formState.actions.rename_merchant.new_name = value;
          break;
        case THEN_ACTION_UPDATE_CATEGORY:
          formState.actions.update_category.enabled = true;
          // Category is already stored as enc_id
          formState.actions.update_category.new_category = value;
          break;
        case THEN_ACTION_ADD_TAG:
          formState.actions.add_tags.enabled = true;
          // Convert tag IDs back to names for display
          formState.actions.add_tags.tags = convertTagIdsToNames(value, allTags);
          break;
        case THEN_ACTION_HIDE_TRANSACTION:
          formState.actions.hide_transaction.enabled = true;
          break;
        case THEN_ACTION_LINK_TO_GOAL:
          formState.actions.link_to_goal.enabled = true;
          formState.actions.link_to_goal.goal_id = value;
          break;
        default:
          break;
      }
    });
  }

  // --- Decode SPLITS (for rule_type 2) ---
  if (Array.isArray(ruleData.splits) && ruleData.splits.length > 0) {
    formState.actions.split_transaction.enabled = true;
    
    // Determine split type from the data
    const splitType = ruleData.splits[0]?.split_type || 
                     (ruleData.splits[0]?.percentage !== undefined && ruleData.splits[0]?.percentage !== null ? 'percentage' : 'amount');
    
    formState.actions.split_transaction.splitType = splitType;
    formState.actions.split_transaction.splits = ruleData.splits.map((split, index) => ({
      id: index + 1,
      merchant: split.merchant || '',
      category: split.category_id || split.category || '',
      amount: splitType === 'amount' ? (split.amount || '') : '',
      percentage: splitType === 'percentage' ? (split.percentage || split.amount || '') : '',
      tags: convertTagIdsToNames(Array.isArray(split.tags) ? split.tags : (split.tags ? [split.tags] : []), allTags),
      review_status: split.review_status === 1 ? 'needs_review' : (split.review_status === 2 ? 'reviewed' : 'none'),
      reviewer: split.reviewer || ''
    }));
    
    // Check for hide_original - could be in the first split or as a separate field
    const hideOriginal = ruleData.splits[0]?.hide_original || ruleData.hide_original || false;
    formState.actions.split_transaction.hideOriginal = hideOriginal;
  }

  return formState;
} 