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

  class fpsTableColumnsChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any[]} params.columns 
     */
    async run(context, { columns }) {
      const { $page, $flow, $application, $constants, $variables } = context;

     const callFunctionResult = await this.storageLocalstorage(context,columns);
    }

    /**
     * @param {Object} context
     */
    async storageLocalstorage(context,columns) {
      const { $page, $flow, $application, $constants, $variables } = context;
      localStorage.setItem("fps4table",JSON.stringify(columns));
    
    }
  }

  return fpsTableColumnsChangeChain;
});
