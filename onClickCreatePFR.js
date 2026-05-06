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

  class onClickCreatePFR extends ActionChain {

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
      const { $page, $flow, $application, $constants, $variables } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'pfmGateway/postPfrCreatevalidation',
        uriParams: {
          'v_fpn_code': current.row.fpn_code,
        },
      });

      if (response.body.status_code !== '200') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Unable to Create New PFR',
          message: response.body.status_msg,
        });

        return;
      } else {
         const toMainPfrEdit = await Actions.navigateToPage(context, {
           page: 'main-pfr-edit',
           params: {
             mode: 'CREATE',
             'pfr_Status': 'Draft',
             'fpn_id': key,
             fpnCode: current.row.fpn_code,
           },
         });
      }

    }
  }

  return onClickCreatePFR;
});
