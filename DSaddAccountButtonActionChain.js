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

  class DSaddAccountButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      const mergeAccounts = await $functions.mergeAccounts($variables.directSharedTableADP.data, $variables.selectedDSaccountADP.data, $application.variables.userRole);

      $variables.directSharedTableADP.data = mergeAccounts;   
      // await Actions.fireNotificationEvent(context, {
      //   summary: JSON.stringify(mergeAccounts),
      // });

      const ojDialogDsTabClose = await Actions.callComponentMethod(context, {
        selector: '#oj-dialog-dsTab',
        method: 'close',
      });
    }
  }

  return DSaddAccountButtonActionChain;
});
