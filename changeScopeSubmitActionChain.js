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

  class changeScopeSubmitActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      try {

        const progressbarOpen = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'open',
        });


        const addUserOpaPayload = await $functions.addUserOpaPayload($application.variables.userInfoObj.FirstName, $application.variables.userInfoObj.LastName, $application.variables.userInfoObj.FirstName + ' ' + $application.variables.userInfoObj.LastName, $application.variables.userInfoObj.UserID, $application.variables.opaUserGroup);
        if ($application.variables.userRole === 'PARTNER_USER' && $application.variables.loginType === 'Partner') {

          const response6 = await Actions.callRest(context, {
            endpoint: 'opaOic/postPlatformUserprovisioning',
            body: addUserOpaPayload,
          });
          if (!response6.ok) {

            await Actions.fireNotificationEvent(context, {
              summary: 'User Provisioning Service Failed',
              type: 'error',
            });
            const progressbarClose4 = await Actions.callComponentMethod(context, {
              selector: '#progressbar',
              method: 'close',
            });

            return;
          }
        }
        const opaAccessTokenPayload = await $functions.opaAccessTokenPayload($application.variables.userInfoObj.UserID);

        const response7 = await Actions.callRest(context, {
          endpoint: 'opaOic/postPlatformUserassertionmgmt',
          body: opaAccessTokenPayload,
        });

        if (!response7.ok) {

          const errorMsg =
            response7.body?.error_description ||
            response7.body?.error ||
            response7.statusText;

          await Actions.fireNotificationEvent(context, {
            summary: 'OPA Token Generation Failed',
            message: errorMsg,
            type: 'error',
          });


          const progressbarClose5 = await Actions.callComponentMethod(context, {
            selector: '#progressbar',
            method: 'close',
          });


          return;
        }

        const formatAsBearerToken = await $functions.formatAsBearerToken(response7.body.access_token);

        $variables.opaAccessToken = formatAsBearerToken;


        const response2 = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getUpdateValidationstate',
          uriParams: {
            'doc_type': 'FPN',
            'fpn_code': $variables.temptableADP.data[0].fpn.fpn_code,
          },
        });

        if (response2.body.items[0].reallocation_required === 'Y') {
          const tempData = $variables.temptableADP?.data || [];
          const fpnData = tempData[0]?.fpn || {};
          const directShared = fpnData.direct_shared?.[0];
          const indirectSupport = fpnData.indirect_support?.[0];

          const fpn_ds_id = directShared?.fpn_ds_id || '';
          const fpn_isc_id = indirectSupport?.fpn_isc_id || '';
          const buildreallocationChangeScopePayload = await $functions.buildreallocationChangeScopePayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID, $application.variables.userInfoObj.UserID, fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'SUBMIT', $variables.retainRunValidationVar, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);
          const Reallocationresponse = await Actions.callRest(context, {
            endpoint: 'OPA/getInstances',
            uriParams: {
              businessKeyLike: $variables.currentFpnCode,
            },
            headers: {
              Authorization: $variables.opaAccessToken,
            },
          });
          if (Reallocationresponse.status === 200 && Reallocationresponse.body.count > 0) {

            const activeInstance = Reallocationresponse.body.items.find(
              item => item.state === 'RUNNING' || item.state === 'ACTIVE'
            );
            const activeInstances = Reallocationresponse.body?.items?.find(i => i.state === 'ACTIVE');
            let instanceId = activeInstances?.rootInstanceId;
            if (activeInstance) {
              const suspendInstanceId = Reallocationresponse.body.items[0].rootInstanceId;


              const suspendPayload = await $functions.getSuspendPayload();


              const response5 = await Actions.callRest(context, {
                endpoint: 'OPA/putInstancesId2',
                uriParams: {
                  id: instanceId,
                },
                headers: {
                  Authorization: formatAsBearerToken,
                },
                body: suspendPayload,
              });

              if (response5.status !== 200) {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Failed to  suspend the running FPN instance during the scope change amendment process',
                });

                const progressbarClose6 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                return;
              }

              const response3 = await Actions.callRest(context, {
                endpoint: 'OPA/postInstances',
                headers: {
                  Authorization: $variables.opaAccessToken,
                },
                body: buildreallocationChangeScopePayload,
              });

              if (!response3.ok) {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submission Failed',
                });

                const progressbarClose3 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                return;
              }
              else {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submitted Successfully',
                  displayMode: 'transient',
                  type: 'confirmation',
                });

                const progressbarClose8 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });


                const results47 = await Promise.all([
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'fpSearchButtonActionChain',
                    });
                  },
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'cancelButtonActionChain',
                    });
                  },
                ].map(sequence => sequence()));

                return;

              }
            }
            else {
              const tempData = $variables.temptableADP?.data || [];
              const fpnData = tempData[0]?.fpn || {};
              const directShared = fpnData.direct_shared?.[0];
              const indirectSupport = fpnData.indirect_support?.[0];

              const fpn_ds_id = directShared?.fpn_ds_id || '';
              const fpn_isc_id = indirectSupport?.fpn_isc_id || '';
              const buildreallocationChangeScopePayload = await $functions.buildreallocationChangeScopePayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID, $application.variables.userInfoObj.UserID, fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'SUBMIT', $variables.retainRunValidationVar, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);
              const response31 = await Actions.callRest(context, {
                endpoint: 'OPA/postInstances',
                headers: {
                  Authorization: $variables.opaAccessToken,
                },
                body: buildreallocationChangeScopePayload,
              });

              if (!response31.ok) {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submission Failed',
                });

                const progressbarClose31 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                return;
              } else {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submitted Successfully',
                  displayMode: 'transient',
                  type: 'confirmation',
                });

                const progressbarClose81 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                const results4a = await Promise.all([
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'fpSearchButtonActionChain',
                    });
                  },
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'cancelButtonActionChain',
                    });
                  },
                ].map(sequence => sequence()));
                return;
              }
            }
          }

        }

        else if (response2.body.items[0].reallocation_required !== 'Y' && $variables.temptableADP.data[0].fpn.fpn_status === 'Approved' && ($application.variables.userRole === 'SENIOR_PROGRAMME_OFFICER' || $application.variables.userRole === 'JUNIOR_PROGRAMME_OFFICER')) {

          const scopeChange = await Actions.callRest(context, {
            endpoint: 'OPA/getInstances',
            uriParams: {
              businessKeyLike: $variables.currentFpnCode,
            },
            headers: {
              Authorization: $variables.opaAccessToken,
            },
          });
          if (scopeChange.status === 200 && scopeChange.body.count > 0) {

            const activeInstance = scopeChange.body.items.find(
              item => item.state === 'RUNNING' || item.state === 'ACTIVE'
            );
            const activeInstances = scopeChange.body?.items?.find(i => i.state === 'ACTIVE');
            let instanceId = activeInstances?.rootInstanceId;
            if (activeInstance) {
              const suspendPayload2 = await $functions.getSuspendPayload();


              const response5 = await Actions.callRest(context, {
                endpoint: 'OPA/putInstancesId2',
                uriParams: {
                  id: instanceId,
                },
                headers: {
                  Authorization: formatAsBearerToken,
                },
                body: suspendPayload2,
              });

              if (response5.status !== 200) {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Failed to suspend the running FPN instance during the scope change amendment process',
                });

                const progressbarClose7 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                return;
              }



              const tempData = $variables.temptableADP?.data || [];
              const fpnData = tempData[0]?.fpn || {};
              const directShared = fpnData.direct_shared?.[0];
              const indirectSupport = fpnData.indirect_support?.[0];

              const fpn_ds_id = directShared?.fpn_ds_id || '';
              const fpn_isc_id = indirectSupport?.fpn_isc_id || '';
              const buildreallocationChangeScopePayload = await $functions.buildreallocationChangeScopePayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID, $application.variables.userInfoObj.UserID, fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'SUBMIT', $variables.retainRunValidationVar, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);
              const response3 = await Actions.callRest(context, {
                endpoint: 'OPA/postInstances',
                headers: {
                  Authorization: $variables.opaAccessToken,
                },
                body: buildreallocationChangeScopePayload,
              });

              if (!response3.ok) {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submission Failed',
                });

                const progressbarClose3 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                return;
              } else {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submitted Successfully',
                  displayMode: 'transient',
                  type: 'confirmation',
                });

                const progressbarClose8 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                const results46 = await Promise.all([
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'fpSearchButtonActionChain',
                    });
                  },
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'cancelButtonActionChain',
                    });
                  },
                ].map(sequence => sequence()));

                return;

              }
            }
            else {
              const tempData = $variables.temptableADP?.data || [];
              const fpnData = tempData[0]?.fpn || {};
              const directShared = fpnData.direct_shared?.[0];
              const indirectSupport = fpnData.indirect_support?.[0];

              const fpn_ds_id = directShared?.fpn_ds_id || '';
              const fpn_isc_id = indirectSupport?.fpn_isc_id || '';
              const buildreallocationChangeScopePayload = await $functions.buildreallocationChangeScopePayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID, $application.variables.userInfoObj.UserID, fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'SUBMIT', $variables.retainRunValidationVar, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);
              const response31 = await Actions.callRest(context, {
                endpoint: 'OPA/postInstances',
                headers: {
                  Authorization: $variables.opaAccessToken,
                },
                body: buildreallocationChangeScopePayload,
              });

              if (!response31.ok) {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submission Failed',
                });

                const progressbarClose31 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                return;
              } else {
                await Actions.fireNotificationEvent(context, {
                  summary: 'Change Scope Submitted Successfully',
                  displayMode: 'transient',
                  type: 'confirmation',
                });

                const progressbarClose81 = await Actions.callComponentMethod(context, {
                  selector: '#progressbar',
                  method: 'close',
                });

                const results4a = await Promise.all([
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'fpSearchButtonActionChain',
                    });
                  },
                  async () => {
                    await Actions.callChain(context, {
                      chain: 'cancelButtonActionChain',
                    });
                  },
                ].map(sequence => sequence()));

                return;

              }
            }
          }

        }
        else {
          const response = await Actions.callRest(context, {
            endpoint: 'OPA/getInstances',
            uriParams: {
              businessKeyLike: $variables.currentFpnCode,
            },
            headers: {
              Authorization: $variables.opaAccessToken,
            },
          });

          if (response.status === 200 && response.body.count > 0) {

            const response2 = await Actions.callRest(context, {
              endpoint: 'OPA/getInstancesInstanceIdActivities',
              uriParams: {
                instanceId: response.body.items[0].rootInstanceId,
              },
              headers: {
                Authorization: $variables.opaAccessToken,
              },
            });

            if (response2.status === 200) {

              const response3 = await Actions.callRest(context, {
                endpoint: 'OPA/getAuditInstancesInstanceIdActivitiesActivityInstanceId',
                uriParams: {
                  activityInstanceId: response2.body.activities[0].activityInstanceId,
                  instanceId: response.body.items[0].rootInstanceId,
                },
                headers: {
                  Authorization: $variables.opaAccessToken,
                },
              });

              if (response3.status === 200) {

                const response4 = await Actions.callRest(context, {
                  endpoint: 'OPA/completeatask',
                  uriParams: {
                    id: response3.body.taskId,
                  },
                  body: {
                    comment: 'Scope Change requested by user',
                    outcome: 'SCOPE CHANGE',
                  },
                  headers: {
                    Authorization: $variables.opaAccessToken,
                  },
                });

                if (response4.status === 200) {
                  await Actions.fireNotificationEvent(context, {
                    type: 'success',
                    summary: 'Scope Change Process Completed',
                    message: 'The scope change has been successfully processed and the scope has been unlocked. You will now be redirected to Compass for further actions.',
                    displayMode: 'transient',
                  });

                  $variables.financialplanTab = 'Tab';
                  $application.variables.mainPageTabSelect = 'oj-tab-bar-2058186034-1-tab-2';

                  const progressbarClose = await Actions.callComponentMethod(context, {
                    selector: '#progressbar',
                    method: 'close',
                  });
                } else {
                  throw new Error('Failed to complete task in OPA.');
                }
              } else {
                throw new Error('Failed to retrieve audit instance activities.');
              }
            } else {
              throw new Error('Failed to retrieve instance activities.');
            }
          } else {
            throw new Error('No instances found for the given business key.');
          }
        }
      }

      catch (error) {
        await Actions.fireNotificationEvent(context, {
          type: 'error',
          summary: 'Error in Scope Change Submission',
          message: error.message,
          displayMode: 'transient',
        });

        const progressbarClose2 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
      }
    }


    /**
     * Redirect to Compass application after unlocking the scope.
     */
    redirectToCompass() {
      const compassUrl = 'https://unhcr-idp.board.com/'; // Replace with actual Compass URL
      window.open(compassUrl, '_blank');
    }
  }

  return changeScopeSubmitActionChain;
});
