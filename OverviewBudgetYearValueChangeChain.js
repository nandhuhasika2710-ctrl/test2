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

  class OverviewBudgetYearValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
       if ($variables.overviewBudgetYearSelectedVar === '' || $variables.overviewBudgetYearSelectedVar === null || $variables.overviewBudgetYearSelectedVar === undefined) {
        $variables.overviewBudgetYearSelectedPersistVar = [];
        
      } else {

         const setToArray = await $functions.setToArray($variables.overviewBudgetYearSelectedVar);

        $variables.overviewBudgetYearSelectedPersistVar = setToArray;
      }
    const array = Array.from(value || []);
    let budgetyear = array.length > 0 ? array.join(',') : null;
     const selectedIds = Array.from(value);
      let valuesArray;
      let numberOfValues;
      if (budgetyear !== null) {
        valuesArray = budgetyear.split(',');
        numberOfValues = valuesArray.length;

        if (selectedIds.includes(7777) && (numberOfValues > 1)) {
          await Actions.resetVariables(context, {
            variables: [
              '$variables.overviewBudgetYearSelectedVar ',
            ],
          });
          budgetyear = null;
        }
        else {
          const isbudgetid = selectedIds.includes(7777);
          if (isbudgetid) {
            const itemsArray = $page.variables.ovBudgetYearLovADP.data;
            const allValuesArray = itemsArray.map(item => item.budget_year_id).filter(budget_year_id => budget_year_id !== 7777);
            $variables.overviewBudgetYearSelectedVar  = new Set(allValuesArray);

          }
        }

      }
      $variables.searchPayload.budgetYear = budgetyear;
    
    }
  }

  return OverviewBudgetYearValueChangeChain;
});
