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

  class cancelButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.originalEvent
     */
    async run(context, { event, originalEvent }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.callChain(context, {
        chain: 'fpSearchButtonActionChain',
      });

      await Actions.fireDataProviderEvent(context, {
        target: $variables.treeTableADP,
        refresh: null,
      });

      await Actions.fireDataProviderEvent(context, {
        target: $variables.indirectSharedADP,
        refresh: null,
      });

      await Actions.fireDataProviderEvent(context, {
        target: $variables.directSharedTableADP,
        refresh: null,
      });

      await Actions.fireDataProviderEvent(context, {
        target: $variables.fpSearchResultSDP,
        refresh: null,
      });

      $variables.financialplanTab = 'Tab';
      $application.variables.mainPageTabSelect = 'oj-tab-bar-2058186034-1-tab-2';
    }
  }

  return cancelButtonActionChain;
});
