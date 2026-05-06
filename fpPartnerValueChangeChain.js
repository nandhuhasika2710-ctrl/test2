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

  class fpPartnerValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;


      if ($variables.fpPartnerSelectedVar === '' || $variables.fpPartnerSelectedVar === null || $variables.fpPartnerSelectedVar === undefined) {
        $variables.fpPartnerSelectedPersistVar = [];

      } else {

        const setToArray = await $functions.setToArray($variables.fpPartnerSelectedVar);

        $variables.fpPartnerSelectedPersistVar = setToArray;
        console.log("fpPartnerSelectedPersistVar" + JSON.stringify($variables.fpPartnerSelectedPersistVar));
      }

      const fpArray = Array.from(value || []);
      let fpPartner = fpArray.length > 0 ? fpArray.join(',') : null;
      console.log("fppatner" + JSON.stringify(fpPartner));
      const selectedIds = Array.from(value);
      let valuesArray;
      let numberOfValues;
      if (fpPartner !== null) {
        valuesArray = fpPartner.split(',');
        numberOfValues = valuesArray.length;

        if (selectedIds.includes(7777) && (numberOfValues > 1)) {
          await Actions.resetVariables(context, {
            variables: [
              '$variables.fpPartnerSelectedVar',
            ],
          });
          fpPartner = null;
        }
        else {
          const ispartnerid = selectedIds.includes(7777);
          if (ispartnerid) {
            const itemsArray = $page.variables.fpPartnerLovADP.data;
            const allValuesArray = itemsArray.map(item => item.partner_number).filter(partner_number => partner_number !== 7777);
            $variables.fpPartnerSelectedVar = new Set(allValuesArray);

          }

          // if (!ispartnerid) {

          //   const response = await Actions.callRest(context, {
          //     endpoint: 'pfmGateway/getGetcontract_number',
          //     uriParams: {
          //       'p_partner': fpPartner,
          //     },
          //   });
          //   if (!response.ok) {
          //     await Actions.fireNotificationEvent(context, {
          //       summary: 'Contract Lov Data Load Failed',
          //       message: response.status + ' - ' + response.statusText,
          //     });

          //   }
          //   else {
          //     let items = response.body.items;
          //     items.unshift({
          //       contract_number: "Select All / Clear All",
          //       contract_number_id: "ALL"
          //     });
          //     $variables.fpContractNumberADP.data = response.body.items;
          //   }
          // }
        }

      }

      if (fpPartner === null && $application.variables.loginType === 'Partner') {
        $variables.fpSearchPayload.partner = $application.variables.defaultPartnerNumber;
      }
      else {
        $variables.fpSearchPayload.partner = fpPartner;
      }


      if (fpPartner == null) {
        // $variables.fpContractNumberADP.data = [];
        // $variables.fpContractNumberSelectedPersistVar = [];
        $variables.fpPartnerSelectedVar = '';
      }

      

      if ($variables.fpContractNumberSelectedPersistVar === '' || $variables.fpContractNumberSelectedPersistVar === null || $variables.fpContractNumberSelectedPersistVar === undefined) {
        $variables.fpContractNumberSelectedVar = '';
      } else {
        const arrayToSet = await $functions.arrayToSet($variables.fpContractNumberSelectedPersistVar);

        $variables.fpContractNumberSelectedVar = arrayToSet;
      }

    }
  }

  return fpPartnerValueChangeChain;
});
