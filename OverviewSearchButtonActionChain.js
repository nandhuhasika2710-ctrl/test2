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

  class OverviewSearchButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;


      await Actions.resetVariables(context, {
        variables: [
          '$variables.fpSearchPayloadButton',
        ],
      });

      $variables.searchPayloadButton.operation = $variables.searchPayload.operation;
      $variables.searchPayloadButton.budgetYear = $variables.searchPayload.budgetYear;
      if ($application.variables.loginType === 'Partner') {
        $variables.searchPayloadButton.partner = $application.variables.defaultPartnerNumber;
      }
      else {
        $variables.searchPayloadButton.partner = $variables.searchPayload.partner;
      }

      const response = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getSearchoverview',
        uriParams: {
          'p_year': $variables.searchPayloadButton.budgetYear,
          'p_operation': $variables.searchPayloadButton.operation,
          'p_partner_id': $variables.searchPayloadButton.partner,
        },
      });

      const overViewTablePagination = await $functions.overViewTablePagination(response.body.items);

      $variables.overviewTable = overViewTablePagination;

      if ($variables.searchPayload.operation == null && $application.variables.loginType !== 'Partner') {

        $variables.searchPayloadButton.operation = $application.variables.securityOperationCodes;
        $variables.searchPayloadButton.budgetYear = $variables.searchPayload.budgetYear;
        $variables.searchPayloadButton.partner = $variables.searchPayload.partner;
        const response = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getSearchoverview',
          uriParams: {
            'p_year': $variables.searchPayloadButton.budgetYear,
            'p_operation': $variables.searchPayloadButton.operation,
            'p_partner_id': $variables.searchPayloadButton.partner,
          },
        });

        const overViewTablePagination = await $functions.overViewTablePagination(response.body.items);

        $variables.overviewTable = overViewTablePagination;
      }

      if ($variables.searchPayload.operation == null && $application.variables.loginType === 'Partner') {

        $variables.searchPayloadButton.operation = $application.variables.securityOperationCodes;
        $variables.searchPayloadButton.budgetYear = $variables.searchPayload.budgetYear;
        $variables.searchPayloadButton.partner = $application.variables.defaultPartnerNumber;
        const response = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getSearchoverview',
          uriParams: {
            'p_year': $variables.searchPayloadButton.budgetYear,
            'p_operation': $variables.searchPayloadButton.operation,
            'p_partner_id': $variables.searchPayloadButton.partner,
          },
        });

        const overViewTablePagination = await $functions.overViewTablePagination(response.body.items);

        $variables.overviewTable = overViewTablePagination;
      }
  


    }
  }

  return OverviewSearchButtonActionChain;
});
