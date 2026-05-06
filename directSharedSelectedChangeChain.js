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

  class directSharedSelectedChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any[]} params.keys 
     * @param {any} params.selected 
     */
    async run(context, { keys, selected }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      $variables.DSselectedRows = keys;
    }
  }

  return directSharedSelectedChangeChain;
});
