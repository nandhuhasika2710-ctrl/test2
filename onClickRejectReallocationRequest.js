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

  class onClickRejectReallocationRequest extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.originalEvent
     */
    async run(context, { event, originalEvent }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
      const progressbarOpen = await Actions.callComponentMethod(context, {
        selector: '#progressbar',
        method: 'open',
      });

      const addUserOpaPayload = await $functions.addUserOpaPayload($application.variables.userInfoObj.FirstName, $application.variables.userInfoObj.LastName, $application.variables.userInfoObj.FirstName + '' + $application.variables.userInfoObj.LastName, $application.variables.userInfoObj.UserID, $application.variables.opaUserGroup);

      const response8 = await Actions.callRest(context, {
        endpoint: 'opaOic/postPlatformUserprovisioning',
        body: addUserOpaPayload,
      });

      const opaAccessTokenPayload = await $functions.opaAccessTokenPayload($application.variables.userInfoObj.UserID);

      const response7 = await Actions.callRest(context, {
        endpoint: 'opaOic/postPlatformUserassertionmgmt',
        body: opaAccessTokenPayload,
      });

      const formatAsBearerToken = await $functions.formatAsBearerToken(response7.body.access_token);

      $variables.opaAccessToken = formatAsBearerToken;
      const instanceResponse = await Actions.callRest(context, {
        endpoint: 'OPA/getInstances',
        uriParams: {
          businessKeyLike: $variables.temptableADP.data[0].fpn.fpn_code,
        },
        headers: {
          Authorization: $variables.opaAccessToken,
        },
      });

      if (instanceResponse.body.count > 0) {
        const response4 = await Actions.callRest(context, {
          endpoint: 'OPA/getInstancesInstanceIdActivities',
          uriParams: {
            instanceId: instanceResponse.body.items[0].rootInstanceId,
          },
          headers: {
            Authorization: $variables.opaAccessToken,
          },
        });

        const response5 = await Actions.callRest(context, {
          endpoint: 'OPA/getAuditInstancesInstanceIdActivitiesActivityInstanceId',
          uriParams: {
            instanceId: instanceResponse.body.items[0].rootInstanceId,
            activityInstanceId: response4.body.activities[0].activityInstanceId,
          },
          headers: {
            Authorization: $variables.opaAccessToken,
          },
        });

        const fpnDataList = $variables.temptableADP?.data || [];
        const fpnDetails = fpnDataList[0]?.fpn || {};
        const directShared = fpnDetails.direct_shared?.[0];
        const indirectSupport = fpnDetails.indirect_support?.[0];

        const fpn_ds_id = directShared?.fpn_ds_id || '';
        const fpn_isc_id = indirectSupport?.fpn_isc_id || '';



        const buildFpnOpaPayload = await $functions.buildFpnOpaPayload(
          fpnDataList,
          $variables.directSharedTableADP?.data || [],
          $variables.indirectSharedADP?.data || [],
          $variables.sharedCostTypeId || '',
          $variables.fpnComment || '',
          $variables.riskRatingLovValue || '',
          $application.variables.userInfoObj.UserID,
          $application.variables.userInfoObj.UserID,
          fpn_ds_id,
          fpn_isc_id,
          $variables.riskRatingTypeId
        );

        const outcomeValue = 'REJECT';
        const commentValue = 'Comment for task completion';

        //    const claimResponse = await Actions.callRest(context, {
        //    endpoint: 'OPA/postTasksIdClaim',
        //    headers: {
        //      Authorization: $variables.opaAccessToken,
        //    },
        //    uriParams: {
        //      id: response5.body.taskId,
        //    },
        //    body: {
        //      comment: 'Claiming task for submission',
        //    },
        //  });

        // if (claimResponse.ok) {

        const response6 = await Actions.callRest(context, {
          endpoint: 'OPA/putTasksIdPayload',
          uriParams: {
            id: response5.body.taskId,
          },
          body: buildFpnOpaPayload,
          headers: {
            Authorization: $variables.opaAccessToken,
          },
        });

        const response3 = await Actions.callRest(context, {
          endpoint: 'OPA/completeatask',
          uriParams: {
            id: response5.body.taskId,
          },
          body: {
            comment: commentValue,
            outcome: outcomeValue,
          },
          headers: {
            Authorization: $variables.opaAccessToken,
          },
        });

        if (response3.status === 200) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Request Sent Successfully',
            type: 'confirmation',
          });

          const progressbarClose = await Actions.callComponentMethod(context, {
            selector: '#progressbar',
            method: 'close',
          });

          const reallocationRequestApproveRejectPopupClose = await Actions.callComponentMethod(context, {
            selector: '#ReallocationRequestApproveRejectPopup',
            method: 'close',
          });
        }
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Request Failed',
          message: 'OPA Call Failed. An unexpected error occurred',
        });

        const progressbarClose2 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });

        const reallocationRequestApproveRejectPopupClose2 = await Actions.callComponentMethod(context, {
          selector: '#ReallocationRequestApproveRejectPopup',
          method: 'close',
        });

        return;
      }
    }
  }



      return onClickRejectReallocationRequest;
    });
