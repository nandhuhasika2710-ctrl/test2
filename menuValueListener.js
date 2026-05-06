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

  class menuValueListener extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{}} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      $variables.columns = event.value.map(v=>$page.variables.columnAll.find(i=>i.field === v));
    }
  }

  return menuValueListener;
});
