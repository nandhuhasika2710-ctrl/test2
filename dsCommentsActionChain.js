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

  class dsCommentsActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.originalEvent
     * @param {any} params.key
     * @param {number} params.index
     * @param {any} params.current
     */
    async run(context, { event, originalEvent, key, index, current }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      $variables.dsCommentsObj.accountNumber=current.datasource.data[0].account_number;
// console.log("currentdata"+JSON.stringify(current.datasource.data.account_number));
      const dscommentHistoryDialogOpen = await Actions.callComponentMethod(context, {
        selector: '#dscommentHistoryDialog',
        method: 'open',
      });
    }
  }

  return dsCommentsActionChain;
});
