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

  class ClaimActionChain extends ActionChain {

    async run(context, { key, index, current }) {
      const { $application, $variables, $functions } = context;

      /* =================================================
         UI VALIDATION – APPLICATION LAYER
      ================================================= */
      if (current.row.fpn_status === 'Approved') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Action Not Allowed',
          message:
            'This FPN is already approved. Locking is not permitted.',
          type: 'error',
          displayMode: 'transient',
        });
        return;
      }

      await Actions.callComponentMethod(context, {
        selector: '#progressbar',
        method: 'open',
      });

      try {



        $variables.claimDetails.instance_id = '';
        $variables.claimDetails.activity_instance_id = '';
        $variables.claimDetails.task_id = '';
        $variables.claimDetails.is_locked = 'Y';
        $variables.claimDetails.locked_by =
          $application.variables.userInfoObj.UserID;

        const dbResp = await Actions.callRest(context, {
          endpoint: 'pfmGateway/postFpnclaim',
          body: await $functions.claimTaskPayload(
            $variables.claimDetails,
            current.item.data.fpn_code
          ),
        });

        if (!dbResp.ok || dbResp.body.status === '400') {
          await Actions.fireNotificationEvent(context, {
            summary: 'Database Error',
            type: 'error',
            displayMode: 'transient',
            message: dbResp.body.response,
          });
          return;
        }

        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $variables.fpSearchResultSDP,
        });

        await Actions.fireNotificationEvent(context, {
          summary: 'FPN Locked',
          message:
            'The FPN has been successfully locked and assigned to you.',
          type: 'confirmation',
          displayMode: 'transient',
        });

        Actions.callChain(context, {
          chain: 'vbEnterListener',
        });
        return;

      } catch (e) {

        await Actions.fireNotificationEvent(context, {
          summary: 'System Error,Please Try Again',
          message: 'An unexpected error occurred while processing the lock request.',
          type: 'error',
          displayMode: 'transient',
        });

      } finally {

        await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
      }
    }
  }

  return ClaimActionChain;
});
