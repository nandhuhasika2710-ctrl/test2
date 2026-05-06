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

  class SelectValueItemChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.key 
     * @param {any} params.data 
     * @param {any} params.metadata 
     */
    async run(context, { key, data, metadata }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      if ($variables.isClicked === true) {
        await $functions.setAppLanguage($variables.selectedLocale);

        // ---- TODO: Add your code here ---- //
        window.location.reload(true);
      }
    }
  }

  return SelectValueItemChangeChain;
});
