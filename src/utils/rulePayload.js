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

export const payloadActionMapper = (action) => {
  const enabledFields = Object.entries(action)
    .filter(([key, value]) => value.enabled)
    .map(([key, value]) => {
      switch (key) {
        case 'rename_merchant':
          return [THEN_ACTION_RENAME_MERCHANT, value.new_name];
        case 'update_category':
          return [THEN_ACTION_UPDATE_CATEGORY, value.new_category];
        case 'add_tags':
          return [THEN_ACTION_ADD_TAG, value.tags];
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