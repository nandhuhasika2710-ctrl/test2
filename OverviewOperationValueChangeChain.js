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

  class OverviewOperationValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value  
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $variable, $functions } = context;
      if ($application.variables.userRole === 'PARTNER_USER' && $application.variables.loginType === 'Partner') {
        await Actions.resetVariables(context, {
          variables: [
            '$variables.overviewPartnerSelectedPersistVar',
          ],
        });
      }
      if ($variables.overviewOperationSelectedVar === '' || $variables.overviewOperationSelectedVar === null || $variables.overviewOperationSelectedVar === undefined) {
        $variables.overviewOperationSelectedPersistVar = [];

      } else {

        const setToArray = await $functions.setToArray($variables.overviewOperationSelectedVar);

        $variables.overviewOperationSelectedPersistVar = setToArray;
      }
      const array = Array.from(value || []);
      let operation = array.length > 0 ? array.join(',') : null;
      let valuesArray;
      let numberOfValues;
      if (operation !== null) {
        valuesArray = operation.split(',');
        numberOfValues = valuesArray.length;

        if (valuesArray.includes('ALL') && (numberOfValues > 1)) {
          // await Actions.fireNotificationEvent(context, {
          //   summary: 'Operation Lov Information',
          //   message: 'Please select SelectAll Option Only',
          //   displayMode: 'persist',
          // });

          await Actions.resetVariables(context, {
            variables: [
              '$variables.overviewOperationSelectedVar',
            ],
          });
          operation = null;
        }
        else {
          if (operation === 'ALL' && $application.variables.loginType !== 'Partner') {
            const itemsArray = $application.variables.ovOperationLovADP.data;


            // const allValuesArray = itemsArray.map(item => item.OperationCode).filter(OperationCode => OperationCode !== "ALL");
            const allValuesArray = itemsArray.map(item => item.operation_code).filter(operation_code => operation_code !== "ALL");
            $variables.overviewOperationSelectedVar = new Set(allValuesArray);

          }

          if (operation === 'ALL' && $application.variables.loginType === 'Partner') {
            const itemsArray = $application.variables.ovOperationLovADP.data;
            const allValuesArray = itemsArray.map(item => item.operation_code).filter(operation_code => operation_code !== "ALL");
            $variables.overviewOperationSelectedVar = new Set(allValuesArray);
            const response2 = await Actions.callRest(context, {
              endpoint: 'pfmGateway/getGetpartnerlov',
              uriParams: {
                'p_organizationid': $application.variables.userInfoObj.OrganizationId,
                'p_usertype': 'PARTNER',
              },
            });

            if (!response2.ok) {
              await Actions.fireNotificationEvent(context, {
                summary: 'Partner Lov Data Load Failed',
                displayMode: 'transient',
              });

              return;
            } else {
              let items = response2.body.items;
              items.unshift({
                partner_name: "Select All / Clear All",
                partner_number: 7777
              });
              $variables.ovPartnerLovADP.data = response2.body.items;
              $variables.defaultTypeNumberForPartner = response2.body.items.map(item => item.partner_number).filter(pn => pn !== 7777).join(',');

            }
          }

          if (operation !== 'ALL' && $application.variables.loginType !== 'Partner') {

            const response = await Actions.callRest(context, {
              endpoint: 'pfmGateway/getGetpartnerlov',
              uriParams: {
                poperation: operation,
                p_usertype: 'UNHCR',
              },
            });

            if (!response.ok) {
              await Actions.fireNotificationEvent(context, {
                summary: 'Partner Lov Data Load Failed',
                message: response.status + ' - ' + response.statusText,
              });

            }
            else {
              let items = response.body.items;
              items.unshift({
                partner_name: "Select All / Clear All",
                partner_number: 7777
              });
              $variables.ovPartnerLovADP.data = response.body.items;
            }
          }
          if (operation !== 'ALL' && $application.variables.loginType === 'Partner') {
            const response4 = await Actions.callRest(context, {
              endpoint: 'pfmGateway/getGetpartnerlov',
              uriParams: {
                'p_organizationid': $application.variables.userInfoObj.OrganizationId,
                'p_usertype': 'PARTNER',
              },
            });

            if (!response4.ok) {
              await Actions.fireNotificationEvent(context, {
                summary: 'Partner Lov Data Load Failed',
                displayMode: 'transient',
              });

              return;
            } else {
              let items = response4.body.items;
              items.unshift({
                partner_name: "Select All / Clear All",
                partner_number: 7777
              });
              $variables.ovPartnerLovADP.data = response4.body.items;
              $variables.defaultTypeNumberForPartner = response4.body.items.map(item => item.partner_number).filter(pn => pn !== 7777).join(',');

            }

          }
        }
      }


      $variables.searchPayload.operation = operation;


      if (operation == null) {
        $variables.ovPartnerLovADP.data = [];

        $variables.overviewOperationSelectedVar = '';

        $variables.overviewPartnerSelectedPersistVar = '';
      }
      if ($variables.overviewPartnerSelectedPersistVar === '' || $variables.overviewPartnerSelectedPersistVar === null || $variables.overviewPartnerSelectedPersistVar === undefined) {
        $variables.overviewPartnerSelectedVar = '';
      } else {
        const arrayToSet = await $functions.arrayToSet($variables.overviewPartnerSelectedPersistVar);

        $variables.overviewPartnerSelectedVar = arrayToSet;
      }
      $variables.searchPayload.operation = operation;
       if ($application.variables.userRole === 'PARTNER_USER' && $application.variables.loginType === 'Partner') {
        const defaultPartner = $application.variables.defaultPartnerNumber;
        if (defaultPartner && defaultPartner.trim() !== '') {
          $variables.overviewPartnerSelectedVar = new Set([defaultPartner.trim()]);
        } else {
          $variables.overviewPartnerSelectedVar = new Set();
        }
      }

    }
  }

  return OverviewOperationValueChangeChain;
});
