// --- CONSTANTS ---
export const IF_DESCRIPTION = 1;
export const IF_AMOUNT = 2;
export const IF_DATE = 3;
export const IF_ACCOUNT = 4;
export const IF_MERCHANT = 5;
export const IF_CATEGORY = 6;

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

export const MERCHANT_MATCH_TYPE_CONTAINS = 1;
export const MERCHANT_MATCH_TYPE_EXACT = 2;
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
      case 'original_statement':
        return [MERCHANT_MATCH_TYPE_ORIGINAL_STATEMENT, matcher.value];
      case 'merchant_name':
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

export const payloadMapper = (condition) => {
  let result = [];
  Object.entries(condition)
    .filter(([key, value]) => value.enabled)
    .forEach(([key, value]) => {
      if (key === 'merchants') {
        value.matchers.forEach(group => {
          group.forEach(matcher => {
            const mapped = matcherMapper(matcher, 'merchants');
            if (mapped) result.push([IF_MERCHANT, ...mapped]);
          });
        });
      } else if (key === 'amount') {
        const mapped = matcherMapper({
          match_type: value.operator,
          value1: value.value1,
          value2: value.value2
        }, 'amount');
        if (mapped) result.push([IF_AMOUNT, ...mapped]);
      } else if (key === 'categories') {
        (value.values || []).forEach(val => result.push([IF_CATEGORY, val]));
      } else if (key === 'accounts') {
        (value.values || []).forEach(val => result.push([IF_ACCOUNT, val]));
      } else if (key === 'description') {
        const mapped = matcherMapper({
          match_type: value.match_type,
          value: value.value
        }, 'description');
        if (mapped) result.push([IF_DESCRIPTION, ...mapped]);
      } else if (key === 'date') {
        const mapped = matcherMapper({
          match_type: value.match_type,
          value1: value.value1,
          value2: value.value2
        }, 'date');
        if (mapped) result.push([IF_DATE, ...mapped]);
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

export const payloadActionMapper = (action, allTags = []) => {
  const enabledFields = Object.entries(action)
    .filter(([key, value]) => value.enabled)
    .map(([key, value]) => {
      switch (key) {
        case 'rename_merchant':
          return [THEN_ACTION_RENAME_MERCHANT, value.new_name];
        case 'update_category':
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

export const payloadSplitMapper = (splitData, allTags = []) => {
  if (!splitData.enabled || !splitData.splits || splitData.splits.length === 0) {
    return null;
  }
  
  return splitData.splits.map(split => ({
    merchant: split.merchant || '',
    category: split.category || null, // Keep as category name, backend will handle the conversion
    amount: splitData.splitType === 'amount' ? parseFloat(split.amount) || 0 : parseFloat(split.percentage) || 0,
    percentage: splitData.splitType === 'percentage' ? parseFloat(split.percentage) || 0 : null,
    split_type: splitData.splitType,
    tags: convertTagNamesToIds(split.tags || [], allTags),
    review_status: split.review_status === 'needs_review' ? 1 : (split.review_status === 'reviewed' ? 2 : 0),
    reviewer: split.reviewer || null,
    hide_original: splitData.hideOriginal || false
  }));
};

/**
 * Reverse-maps rule_data (with ifs/thens) to the form state for editing.
 * @param {object} ruleData - The parsed rule_data object from the API
 * @returns {object} - The form state for the rule
 */
export function decodeRuleData(ruleData, allTags = []) {
  // Default form state structure
  const formState = {
    conditions: {
      merchants: { enabled: false, matchers: [[{ match_type: 'exactly_matches', value: '' }]] },
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
  if (Array.isArray(ruleData.ifs)) {
    // Merchants: group by AND/OR not supported in compact format, so flatten
    let merchantMatchers = [];
    ruleData.ifs.forEach(cond => {
      const [type, ...rest] = cond;
      switch (type) {
        case IF_MERCHANT: {
          formState.conditions.merchants.enabled = true;
          const [matchType, value] = rest;
          let match_type = 'contains';
          if (matchType === MERCHANT_MATCH_TYPE_CONTAINS) match_type = 'contains';
          else if (matchType === MERCHANT_MATCH_TYPE_EXACT) match_type = 'exactly_matches';
          else if (matchType === MERCHANT_MATCH_TYPE_ORIGINAL_STATEMENT) match_type = 'original_statement';
          else if (matchType === MERCHANT_MATCH_TYPE_MERCHANT_NAME) match_type = 'merchant_name';
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
          const [category] = rest;
          formState.conditions.categories.values.push(category);
          break;
        }
        case IF_ACCOUNT: {
          formState.conditions.accounts.enabled = true;
          const [account] = rest;
          formState.conditions.accounts.values.push(account);
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
      // Group all merchant matchers into a single OR group for simplicity
      formState.conditions.merchants.matchers = [merchantMatchers];
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
      category: split.category || split.category_id || '', // Support both category name and ID
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