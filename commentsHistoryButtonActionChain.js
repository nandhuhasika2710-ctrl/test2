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

  class commentsHistoryButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.originalEvent
     */
    async run(context, { event, originalEvent }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.fireDataProviderEvent(context, {
        refresh: null,
        target: $variables.commentsSDP,
      });

      const commentHistoryDialogOpen = await Actions.callComponentMethod(context, {
        selector: '#commentHistoryDialog',
        method: 'open',
      });
    }
  }

  return commentsHistoryButtonActionChain;
});
