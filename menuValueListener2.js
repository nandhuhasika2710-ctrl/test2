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

  class menuValueListener2 extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{oldValue:string[],value:string[]}} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables } = context;

    }
  }

  return menuValueListener2;
});
