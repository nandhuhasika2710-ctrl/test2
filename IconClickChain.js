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

  class IconClickChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.key 
     * @param {number} params.index 
     * @param {any} params.current 
     */
    async run(context, { key, index, current }) {
      const { $page, $flow, $application, $constants, $variables, $current, $event, $functions } = context;

       await Actions.resetVariables(context, {
        variables: [
    '$variables.financialPlanStatus',
  ],
      });

      $variables.financialplanTab = 'Edit';
      $variables.financialPlanStatus = current.row.fpn_status;
      $variables.currentFpnCode = current.row.fpn_code;

      await Actions.callChain(context, {
        chain: 'statusAssign',
      });
    }
  }

  return IconClickChain;
});
