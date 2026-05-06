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

  class fpSearchButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      await Actions.resetVariables(context, {
        variables: [
    '$variables.oicOperationsearchPayload',
  ],
      });

      $variables.oicOperationsearchPayload.Operation_Code = $variables.fpSearchPayload.operation;
      $variables.oicOperationsearchPayload.Budget_Year = $variables.fpSearchPayload.budgetYear;
      $variables.oicOperationsearchPayload.Partner_Number = $variables.fpSearchPayload.partner;
      $variables.oicOperationsearchPayload.Contract_Number = $variables.fpSearchPayload.contractNumber;

      if ($variables.fpSearchPayload.operation == null && $application.variables.loginType !== 'Partner') {
        $variables.oicOperationsearchPayload.Operation_Code = $application.variables.securityOperationCodes;
      }
      if ( $application.variables.loginType === 'Partner') {
        $variables.oicOperationsearchPayload.Partner_Number = $application.variables.defaultPartnerNumber;
      }
      if ($variables.fpSearchPayload.operation == null && $application.variables.loginType === 'Partner') {

        $variables.oicOperationsearchPayload.Operation_Code = $application.variables.securityOperationCodes;
        $variables.oicOperationsearchPayload.Partner_Number = $application.variables.defaultPartnerNumber;
      }
      const response = await Actions.callRest(context, {
        endpoint: 'OICService/postRetrieveBySearch',
        body: $variables.oicOperationsearchPayload,
      });
      if (response.body.hasOwnProperty("items")) {
        $variables.fpsearchResultADP.data = response.body.items;

        const searchTablePagination2 = await $functions.searchTablePagination(response.body.items);
        $variables.financialSearchPageTable = searchTablePagination2;


      }
      else {
        $variables.fpsearchResultADP.data = [];

        const searchTablePagination2 = await $functions.searchTablePagination([]);
        $variables.financialSearchPageTable = searchTablePagination2;

      }
    }
  }


return fpSearchButtonActionChain;
});
