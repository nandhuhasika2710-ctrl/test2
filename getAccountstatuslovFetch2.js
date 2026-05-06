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

  class getAccountstatuslovFetch2 extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{hookHandler:'vb/RestHookHandler'}} params.configuration
     */
    async run(context, { configuration }) {
      const { $page, $flow, $application, $constants, $variables } = context;
       if (configuration.hookHandler.context.fetchOptions.filterCriterion) {
        if (configuration.hookHandler.context.fetchOptions.filterCriterion.text.length >= 1) {
          const response = await Actions.callRest(context, {
            endpoint: 'pfmGateway/getAccountstatuslov',
            uriParams: {
              'p_lookup_type': 'FPN_STATUS',
              'p_partner_type': $application.variables.userRole,
              'p_current_status': $variables.financialPlanStatus,
            },
          });

          if (!response.ok) {
            await Actions.fireNotificationEvent(context, {
              summary: 'Fetching Error',
              displayMode: 'transient',
            });
          } else {
            return response;
          }
        }
      } 
      else {
        const callRestEndpoint1 = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getAccountstatuslov',
          uriParams: {
            'p_lookup_type': 'FPN_STATUS',
            'p_partner_type': $application.variables.userRole,
            'p_current_status': $variables.financialPlanStatus,
          },
          responseType: 'getLinestatusDPType',
          hookHandler: configuration.hookHandler,
          requestType: 'json',
        });
        // const currentStatus = $variables.financialPlanStatus;
        // const lovList = callRestEndpoint1.body?.items || [];
        // const isMissing = currentStatus && !lovList.some(item => item.lookup_values === currentStatus);

        // if (isMissing) {
        //   lovList.unshift({
        //     lookup_values: currentStatus
        //   });
        // }

        // callRestEndpoint1.body.items = lovList;

        return callRestEndpoint1;
      }
    }
  }

  return getAccountstatuslovFetch2;
});
