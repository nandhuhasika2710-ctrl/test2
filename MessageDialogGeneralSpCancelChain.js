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

  class MessageDialogGeneralSpCancelChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.callComponentMethod(context, {
        selector: '#uploaderrordialog',
        method: 'close',
      });
    }
  }

  return MessageDialogGeneralSpCancelChain;
});
