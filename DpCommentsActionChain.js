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

  class DpCommentsActionChain extends ActionChain {

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
      const { $page, $flow, $application, $constants, $variables, $functions } = context;


      // const separateDpCommentIds = await $functions.separateDpCommentIds(key, current.data);

      $variables.dpCommentsObj.accountNumber = current.data.accountCode;
      $variables.dpCommentsObj.locationCode = current.data.loc;
      $variables.dpCommentsObj.outputCode = current.data.output_code;

      const dpcommentHistoryDialogOpen = await Actions.callComponentMethod(context, {
        selector: '#dpcommentHistoryDialog',
        method: 'open',
      });
    }
  }

  return DpCommentsActionChain;
});
