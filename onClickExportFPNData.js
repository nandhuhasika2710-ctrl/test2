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

  class onClickExportFPNData extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      console.log("Tree Table ADP Data: ", JSON.stringify($variables.temptableADP.data));
      console.log("Direct Shared Data: ", JSON.stringify($variables.directSharedTableADP.data));
      console.log("Indirect Shared Data: ", JSON.stringify($variables.indirectSharedADP.data));
      const fpnData = $variables.temptableADP.data;  // Assuming this contains the main data
      const directSharedData = $variables.directSharedTableADP.data;

      const response = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getAccounts',
        uriParams: {
          'p_account_type': 'DP',
        },
      });

      const response2 = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getAccounts',
        uriParams: {
          'p_account_type': 'DS',
        },
      });

      await $functions.exportFPNDataToExcel(fpnData, response.body.items, response2.body.items, directSharedData, $variables.currentFpnCode);
    }
  }

  return onClickExportFPNData;
});
