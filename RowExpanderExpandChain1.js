define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class RowExpanderExpandChain1 extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.event
     * @param {any} params.rowKey
     * @param {any} params.key
     * @param {number} params.index
     * @param {any} params.current
     */
    async run(context, { event, rowKey, key, index, current }) {
      const { $variables } = context;

      // Debug notification
      await Actions.fireNotificationEvent(context, {
        summary: rowKey,
      });

      // --- FIX: use key, because row is not provided ---
      if (!key) {
        console.warn("RowExpanderExpandChain1: Missing key", key);
        return;
      }

      const expandedKeys = $variables.expandedKeys || [];

      // Add current key
      if (!expandedKeys.includes(key)) {
        expandedKeys.push(key);
      }

      // Add parent if present in 'current'
      if (current && current.parentKey && !expandedKeys.includes(current.parentKey)) {
        expandedKeys.push(current.parentKey);
      }

      $variables.expandedKeys = expandedKeys;

      console.log("Expanded Keys Updated:", $variables.expandedKeys);
    }
  }

  return RowExpanderExpandChain1;
});
