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

  class getAccountsFetch extends ActionChain {

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
            endpoint: 'pfmGateway/getAccounts',
            uriParams: {
              'p_account_type': 'DS',
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
          endpoint: 'pfmGateway/getAccounts',
          uriParams: {
            'p_account_type': 'DS',
          },
          responseType: 'getDSAccounts',
        });


        return callRestEndpoint1;
      }

    }
  }

  return getAccountsFetch;
});
