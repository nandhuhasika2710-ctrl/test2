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

  class menuUpdatePageValueListener extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{oldValue:string[],value:string[]}} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables } = context;


      $variables.tableColumnArray = event.value.map(v=>$page.variables.tableColumnArrayAll.find(i=>i.field === v));
      // $variables.tableColumnArray = event.value.map(v => {
      //   const col = $page.variables.tableColumnArrayAll.find(i => i.field === v);
      //   return col ? { ...col } : null;
      // }).filter(Boolean);

    }
  }

  return menuUpdatePageValueListener;
});
