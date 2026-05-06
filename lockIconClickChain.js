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

  class lockIconClickChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.key 
     * @param {number} params.index 
     * @param {any} params.current 
     * @param {string} params.fpn_id 
     */
    async run(context, { key, index, current, fpn_id = '$current.row.fpn_id' }) {
      const { $page, $flow, $application, $constants, $variables, $current } = context;

      // await Actions.fireNotificationEvent(context, {
      //   summary: 'test',
      //   message: fpn_id,
      // });
    }
  }

  return lockIconClickChain;
});
