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

  class directSharedTableBeforeRowEditEndChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.cancelEdit 
     * @param {any} params.rowKey 
     * @param {number} params.rowIndex 
     * @param {any} params.rowData 
     */
    async run(context, { cancelEdit, rowKey, rowIndex, rowData }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;


      const dsupdateAdpData = await $functions.dsupdateAdpData($variables.directSharedTableADP, $variables.directSharedCurrentRow);

      console.log("updated data"+JSON.stringify(dsupdateAdpData));

      $variables.directSharedTableADP.data = dsupdateAdpData;
    }
  }

  return directSharedTableBeforeRowEditEndChain;
});
