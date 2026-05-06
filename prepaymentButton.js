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

  class prepaymentButton extends ActionChain {

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
        endpoint: 'pfmGateway/getFpn_prepayments',
        uriParams: {
          'p_fpn_code': current.row.fpn_code,
        },
      });

      if (!response.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Prepayment Create API Load Failed',
          message: response.status + ' - ' + response.statusText,
        });

        
      }
      else{
     

      if (response.body.items[0].res === 'N') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Prepayment Create ',
          message: 'Please complete existing prepayment for fpn',
        });

      }
      else{
       const toPrepaymentAddEdit = await Actions.navigateToPage(context, {
               page: 'prepayment-add-edit',
               params: {
                 paramStatus: 'Draft',
                 ViewEditVar: 'Edit',
                 prepaymentDocumentNo: current.row.fpn_code,
                 mode: 'create',
               },
             });
      }
     
      }
           
    
    
    }
  }

  return prepaymentButton;
});
