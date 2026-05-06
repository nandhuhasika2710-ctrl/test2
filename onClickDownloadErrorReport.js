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

  class onClickDownloadErrorReport extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      const generateFailedRowsReport = await $functions.generateFailedRowsReport($variables.excelImportFailedData);

      await $functions.downloadReport(generateFailedRowsReport);

      await Actions.callComponentMethod(context, {
        selector: '#uploaderrordialog',
        method: 'close',
      });
      
    }
  }

  return onClickDownloadErrorReport;
});
