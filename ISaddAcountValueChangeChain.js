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

  class ISaddAcountValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any[]} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      $variables.selectedISaccount = value;

      const response = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getAccounts',
        uriParams: {
          'p_account_type': 'IS',
        },
      });

      const selectedDSAccountTable = await $functions.selectedDSAccountTable(response.body.items, $variables.selectedISaccount);

      $variables.selectedISaccountADP.data = selectedDSAccountTable;
    }
  }

  return ISaddAcountValueChangeChain;
});
