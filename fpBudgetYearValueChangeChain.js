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

  class fpBudgetYearValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
      if ($variables.fpBudgetYearSelectedVar === '' || $variables.fpBudgetYearSelectedVar === null || $variables.fpBudgetYearSelectedVar === undefined) {
        $variables.fpBudgetYearSelectedPersistVar = [];

      } else {

        const setToArray = await $functions.setToArray($variables.fpBudgetYearSelectedVar);

        $variables.fpBudgetYearSelectedPersistVar = setToArray;
        
      }
      const fpArray = Array.from(value || []);
      let fpBudgetYear = fpArray.length > 0 ? fpArray.join(',') : null;

      const selectedIds = Array.from(value);

      let valuesArray;
      let numberOfValues;
      if (fpBudgetYear !== null) {
        valuesArray = fpBudgetYear.split(',');
        numberOfValues = valuesArray.length;

        if (selectedIds.includes(7777) && (numberOfValues > 1)) {
          await Actions.resetVariables(context, {
            variables: [
              '$variables.fpBudgetYearSelectedVar',
            ],
          });
          fpBudgetYear = null;
        }
        else {
          const isbudgetid = selectedIds.includes(7777);
          if (isbudgetid) {
            const itemsArray = $page.variables.fpBudgetYearLovADP.data;
            const allValuesArray = itemsArray.map(item => item.budget_year_id).filter(budget_year_id => budget_year_id !== 7777);
            $variables.fpBudgetYearSelectedVar = new Set(allValuesArray);

          }
          if (!isbudgetid) {

            const response = await Actions.callRest(context, {
              endpoint: 'pfmGateway/getGetcontract_number',
              uriParams: {
                pyear: fpBudgetYear,
              },
            });
            if (!response.ok) {
              await Actions.fireNotificationEvent(context, {
                summary: 'Contract Lov Data Load Failed',
                message: response.status + ' - ' + response.statusText,
              });

            }
            else {
              let items = response.body.items;
              items.unshift({
                contract_number: "Select All / Clear All",
                contract_number_id: "ALL"
              });
              $variables.fpContractNumberADP.data = response.body.items;
            }
          }
        }

      }
      $variables.fpSearchPayload.budgetYear = fpBudgetYear;
      if (fpBudgetYear == null) {
        $variables.fpContractNumberADP.data = [];
        $variables.fpContractNumberSelectedPersistVar = [];
        $variables.fpBudgetYearSelectedVar = '';
      }
      if ($variables.fpContractNumberSelectedPersistVar === '' || $variables.fpContractNumberSelectedPersistVar === null || $variables.fpContractNumberSelectedPersistVar === undefined) {
        $variables.fpContractNumberSelectedVar = '';
      } else {
        const arrayToSet = await $functions.arrayToSet($variables.fpContractNumberSelectedPersistVar);

        $variables.fpContractNumberSelectedVar = arrayToSet;
      }

    }
  }

  return fpBudgetYearValueChangeChain;
});
