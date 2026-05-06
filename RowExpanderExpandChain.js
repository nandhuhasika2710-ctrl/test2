define(['vb/action/actionChain'], (ActionChain) => {
  'use strict';

  class RowExpanderExpandChain extends ActionChain {
    async run(context, { rowKey, key, index, current, event }) {
      const { $variables } = context;

      // Determine the row key properly
      const rowId = rowKey || key;
      if (!rowId) {
        console.warn('RowExpanderExpandChain: no valid row key', { rowKey, key, current });
        return;
      }

      const expandedKeys = Array.isArray($variables.expandedKeys) ? [...$variables.expandedKeys] : [];

      if (!expandedKeys.includes(rowId)) {
        expandedKeys.push(rowId);
      }

      // If parent key exists
      if (current && current.parentKey && !expandedKeys.includes(current.parentKey)) {
        expandedKeys.push(current.parentKey);
      }

      $variables.expandedKeys = expandedKeys;
      console.log("Expanded keys updated:", $variables.expandedKeys);
    }
  }


  return RowExpanderExpandChain;
});
