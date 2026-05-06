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

  class onSelectStatus extends ActionChain {
    async run(context, { event, previousValue, value }) {
      const { $variables } = context;

      
    }
  }

  return onSelectStatus;
});
