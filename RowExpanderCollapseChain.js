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

  class RowExpanderCollapseChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.rowKey
     * @param {any} params.key
     * @param {number} params.index
     * @param {any} params.current
     */
    async run(context, { event, rowKey, key, index, current }) {
      const { $page, $flow, $application, $constants, $variables } = context;
      if (!rowKey) return;

      let expandedKeys = Array.isArray($variables.expandedKeys)
        ? [...$variables.expandedKeys]
        : [];

      // Remove the collapsed row key
      expandedKeys = expandedKeys.filter(k => k !== rowKey);

      $variables.expandedKeys = expandedKeys;

      console.log('Row collapsed, updated expandedKeys:', expandedKeys);
    
    }
  }

  return RowExpanderCollapseChain;
});
