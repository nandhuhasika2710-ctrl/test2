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

  class fpOperationValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;


      if ($variables.fpOperationSelectedVar === '' || $variables.fpOperationSelectedVar === null || $variables.fpOperationSelectedVar === undefined) {
        $variables.fpOperationSelectedPersistVar = [];

      } else {

        const setToArray = await $functions.setToArray($variables.fpOperationSelectedVar);

        $variables.fpOperationSelectedPersistVar = setToArray;
      }
      const fpArray = Array.from(value || []);
      let fpOperation = fpArray.length > 0 ? fpArray.join(',') : null;

      let valuesArray;
      let numberOfValues;
      if (fpOperation !== null) {
        valuesArray = fpOperation.split(',');
        numberOfValues = valuesArray.length;

        if (valuesArray.includes('ALL') && (numberOfValues > 1)) {

          await Actions.resetVariables(context, {
            variables: [
              '$variables.fpOperationSelectedVar',
            ],
          });
          fpOperation = null;
        }
        else {
          if (fpOperation === 'ALL' && $application.variables.loginType !== 'Partner') {
            const itemsArray = $application.variables.fpOperationLovADP.data;
            // const allValuesArray = itemsArray.map(item => item.OperationCode).filter(OperationCode => OperationCode !== "ALL");
            const allValuesArray = itemsArray.map(item => item.operation_code).filter(operation_code => operation_code !== "ALL");
            $variables.fpOperationSelectedVar = new Set(allValuesArray);
          }
          if (fpOperation === 'ALL' && $application.variables.loginType === 'Partner') {
            const itemsArray = $application.variables.fpOperationLovADP.data;
            // const allValuesArray = itemsArray.map(item => item.OperationCode).filter(OperationCode => OperationCode !== "ALL");
            const allValuesArray = itemsArray.map(item => item.operation_code).filter(operation_code => operation_code !== "ALL");
            $variables.fpOperationSelectedVar = new Set(allValuesArray);
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
              $variables.fpPartnerLovADP.data = response2.body.items;
              $variables.defaultTypeNumberForPartner = response2.body.items.map(item => item.partner_number).filter(pn => pn !== 7777).join(',');


            }

          }

          if (fpOperation !== 'ALL' && $application.variables.loginType !== 'Partner') {
            const response = await Actions.callRest(context, {
              endpoint: 'pfmGateway/getGetpartnerlov',
              uriParams: {
                poperation: fpOperation,
                'p_usertype': 'UNHCR',
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
              $variables.fpPartnerLovADP.data = response.body.items;
            }
          }

          if (fpOperation !== 'ALL' && $application.variables.loginType === 'Partner') {
            const response3 = await Actions.callRest(context, {
              endpoint: 'pfmGateway/getGetpartnerlov',
              uriParams: {
                'p_organizationid': $application.variables.userInfoObj.OrganizationId,
                'p_usertype': 'PARTNER',
              },
            });

            if (!response3.ok) {
              await Actions.fireNotificationEvent(context, {
                summary: 'Partner Lov Data Load Failed',
                displayMode: 'transient',
              });

              return;
            } else {
              let items = response3.body.items;
              items.unshift({
                partner_name: "Select All / Clear All",
                partner_number: 7777
              });
              $variables.fpPartnerLovADP.data = response3.body.items;
              $variables.defaultTypeNumberForPartner = response3.body.items.map(item => item.partner_number).filter(pn => pn !== 7777).join(',');
            }

          }

        }
      }








      if (fpOperation == null) {
        $variables.fpPartnerLovADP.data = [];
        // $variables.fpContractNumberADP.data = [];
        $variables.fpOperationSelectedVar = '';
        $variables.fpPartnerSelectedPersistVar = [];
        // $variables.fpContractNumberSelectedPersistVar = [];
      }

      if ($variables.fpPartnerSelectedPersistVar === '' || $variables.fpPartnerSelectedPersistVar === null || $variables.fpPartnerSelectedPersistVar === undefined) {
        $variables.fpPartnerSelectedVar = '';
      } else {
        const arrayToSet = await $functions.arrayToSet($variables.fpPartnerSelectedPersistVar);

        $variables.fpPartnerSelectedVar = arrayToSet;
      }

      $variables.fpSearchPayload.operation = fpOperation;
      if ($application.variables.userRole === 'PARTNER_USER' && $application.variables.loginType === 'Partner') {
        const defaultPartner = $application.variables.defaultPartnerNumber;
        if (defaultPartner && defaultPartner.trim() !== '') {
          $variables.fpPartnerSelectedVar = new Set([defaultPartner.trim()]);
        } else {
          $variables.fpPartnerSelectedVar = new Set();
        }
      }

    }
  }

  return fpOperationValueChangeChain;
});
