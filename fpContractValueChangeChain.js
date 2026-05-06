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

  class fpContractValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      if ($variables.fpContractNumberSelectedVar === '' || $variables.fpContractNumberSelectedVar === null || $variables.fpContractNumberSelectedVar === undefined) {
        $variables.fpContractNumberSelectedPersistVar = [];

      } else {

        const setToArray = await $functions.setToArray($variables.fpContractNumberSelectedVar);

        $variables.fpContractNumberSelectedPersistVar = setToArray;
      }
      const fpArray = Array.from(value || []);
      let fpContract = fpArray.length > 0 ? fpArray.join(',') : null;
      let valuesArray;
      let numberOfValues;
      if (fpContract !== null) {
        valuesArray = fpContract.split(',');
        numberOfValues = valuesArray.length;

        if (valuesArray.includes('ALL') && (numberOfValues > 1)) {

          await Actions.resetVariables(context, {
            variables: [
              '$variables.fpContractNumberSelectedVar',
            ],
          });
          fpContract = null;
        }
        else {
          if (fpContract === 'ALL') {
            const itemsArray = $page.variables.fpContractNumberADP.data;
            const allValuesArray = itemsArray.map(item => item.contract_number_id).filter(contract_number_id => contract_number_id !== "ALL");
            $variables.fpContractNumberSelectedVar = new Set(allValuesArray);

          }
        }
      }
      $variables.fpSearchPayload.contractNumber = fpContract;

    }
  }

  return fpContractValueChangeChain;
});
