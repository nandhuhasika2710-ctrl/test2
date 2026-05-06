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

  class getAccountstatuslovFetch4 extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{hookHandler:'vb/RestHookHandler'}} params.configuration
     */
    async run(context, { configuration }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      const callRestEndpoint1 = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getAccountstatuslov',
        uriParams: {
          'p_current_status': $variables.directSharedCurrentRow.account_status_code,
          'p_lookup_type': 'FPN_STATUS',
          'p_partner_type': $application.variables.userRole,
        },
        responseType: 'getDSAccountstatuslov',
        hookHandler: configuration.hookHandler,
        requestType: 'json',
      });

      return callRestEndpoint1;
    }
  }

  return getAccountstatuslovFetch4;
});
