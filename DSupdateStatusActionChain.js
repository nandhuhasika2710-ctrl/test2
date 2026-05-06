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

  class DSupdateStatusActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
      const dsUpdateStatus = await $functions.dsUpdateStatus($variables.dsStatusUpdateRowsADP.data, $variables.directSharedTableADP.data, $variables.dsAccountStatusValue)
;

      $variables.directSharedTableADP.data = dsUpdateStatus;

      await Actions.fireDataProviderEvent(context, {
        target: $variables.directSharedTableADP,
        refresh: null,
      });

      const ojDialogDsStatusClose = await Actions.callComponentMethod(context, {
        selector: '#oj-dialog-ds-status',
        method: 'close',
      });
    }
  }

  return DSupdateStatusActionChain;
});
