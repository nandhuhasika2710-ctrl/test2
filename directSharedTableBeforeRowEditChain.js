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

  class directSharedTableBeforeRowEditChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.rowKey 
     * @param {number} params.rowIndex 
     * @param {any} params.rowData 
     */
    async run(context, { rowKey, rowIndex, rowData }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      $variables.directSharedCurrentRow = rowData;
      // $variables.directSharedCurrentRow.account_status_code ='Proposed';
              $variables.retainRunValidationVar = 'N';
        $variables.validationColor = 'runvalidation_orange';
        $variables.fpnDraftSubmitStatus = 'DRAFT';
      
    }
  }

  return directSharedTableBeforeRowEditChain;
});
