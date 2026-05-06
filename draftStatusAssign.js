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

  class draftStatusAssign extends ActionChain {
    async run(context) {
      const { $application, $variables } = context;


      const statusOrder = [
        { id: '0', label: $application.translations.appBundle.train_label_scoped },
        { id: '1', label: $application.translations.appBundle.train_label_proposed },
        { id: '2', label: $application.translations.appBundle.train_label_endorsedrevised },
        { id: '3', label: $application.translations.appBundle.train_label_agreed },
        { id: '4', label: $application.translations.appBundle.train_label_approved }
      ];

      const statusIndexMap = {
        'Scoped': 0,
        'Rescoped': 0,
        'Proposed': 1,
        'Endorsed/Revised': 2,
        'Endorsed': 2,
        'Revised': 2,
        'Agreed': 3,
        'Approved': 4,
        'Rejected':0,
        'Error':1
      };

      const currentIndex = statusIndexMap[$variables.financialPlanStatus];

      if (currentIndex === undefined) return;

      $variables.steps = statusOrder.map((step, index) => {

        let messageType = 'none';
        let visited = false;

        if (index < currentIndex) {
          messageType = 'confirmation'; // Previous → tick
          visited = true;
        }
        else if (index === currentIndex) {
          messageType = 'info'; // Current → circle
          visited = true;
        }

        return {
          ...step,
          disabled: true,
          visited,
          messageType
        };
      });

      // $variables.selectedStatus = String(currentIndex);
    }
  }

  return draftStatusAssign;
});