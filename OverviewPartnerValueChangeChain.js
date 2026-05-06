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

  class OverviewPartnerValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
      if ($variables.overviewPartnerSelectedVar === '' || $variables.overviewPartnerSelectedVar === null || $variables.overviewPartnerSelectedVar === undefined) {
        $variables.overviewPartnerSelectedPersistVar = [];

      } else {

        const setToArray = await $functions.setToArray($variables.overviewPartnerSelectedVar);

        $variables.overviewPartnerSelectedPersistVar = setToArray;
      }
      const array = Array.from(value || []);
      let partner = array.length > 0 ? array.join(',') : null;
      const selectedIds = Array.from(value || []);
      let valuesArray;
      let numberOfValues;
      if (partner !== null) {
        valuesArray = partner.split(',');
        numberOfValues = valuesArray.length;

        if (selectedIds.includes(7777) && (numberOfValues > 1)) {
          await Actions.resetVariables(context, {
            variables: [
              '$variables.overviewPartnerSelectedVar',
            ],
          });
          partner = null;
        }
        else {
          const ispartnerid = selectedIds.includes(7777);
          if (ispartnerid) {
            const itemsArray = $page.variables.ovPartnerLovADP.data;
            const allValuesArray = itemsArray.map(item => item.partner_number).filter(partner_number => partner_number !== 7777);
            $variables.overviewPartnerSelectedVar = new Set(allValuesArray);

          }
        }
      }
      if (partner === null && $application.variables.loginType === 'Partner') {
        $variables.searchPayload.partner = $variables.defaultTypeNumberForPartner;
      }
      else {
        $variables.searchPayload.partner = partner;
      }
    }
  }


  return OverviewPartnerValueChangeChain;
});
