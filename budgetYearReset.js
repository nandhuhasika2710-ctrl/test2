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

  class budgetYearReset extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.previousValue
     * @param {any} params.value
     * @param {string} params.updatedFrom
     * @param {any} params.valueItems
     */
    async run(context, { event, previousValue, value, updatedFrom, valueItems }) {
      const { $page, $flow, $application, $constants, $variables } = context;
      
    let viArray = Array.from(value || []);
     let viarraychange = viArray.length > 0 ? viArray.join(',') : null;
     
      if (viarraychange === null) {

        $variables.overviewBudgetYearSelectedVar = '';

        $variables.overviewBudgetYearSelectedPersistVar = '';
               
	  }
   
      
    }
  }

  return budgetYearReset;
});
