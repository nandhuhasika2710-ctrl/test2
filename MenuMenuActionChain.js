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

  class MenuMenuActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.menuId 
     */
    async run(context, { menuId }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      if (menuId === 'assignAccount') {
        $variables.retainRunValidationVar = 'N';
        $variables.validationColor = 'runvalidation_orange';
        $variables.fpnDraftSubmitStatus = 'DRAFT';
        if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-1') {
          await Actions.resetVariables(context, {
            variables: [
              '$variables.selectedDataTableADP.data',
              '$variables.selectedAccount',
            ],
          });
          const selectedOutpuandLocations2 = await $functions.selectedOutpuandLocations($variables.temptableADP.data, $variables.selectedADP);

          $variables.selectedDataTableADP.data = selectedOutpuandLocations2;

          const ojDialog549983881Open = await Actions.callComponentMethod(context, {
            selector: '#oj-dialog-54998388-1',
            method: 'open',
          });
        }
        else if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-2') {
          const ojDialogDsTabOpen = await Actions.callComponentMethod(context, {
            selector: '#oj-dialog-dsTab',
            method: 'open',
          });

        }
        else if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-3') {
          const ojDialogIsTabOpen = await Actions.callComponentMethod(context, {
            selector: '#oj-dialog-isTab',
            method: 'open',
          });

        }
      }

      if (menuId === 'status') {
        $variables.retainRunValidationVar = 'N';

        $variables.validationColor = 'runvalidation_orange';
        $variables.fpnDraftSubmitStatus = 'DRAFT';
        if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-1') {
          const selectedOutpuandLocations = await $page.functions.selectedOutpuandLocations($variables.temptableADP.data, $variables.selectedADP);

          $variables.selectedDataTableADP.data = selectedOutpuandLocations;

          if ($variables.reallocationRequired === 'Y') {

            await Actions.fireDataProviderEvent(context, {
              refresh: null,
              target: $variables.reallocationMultiLevelStatusSDP,
            });

          }
          else {
            await Actions.fireDataProviderEvent(context, {
              refresh: null,
              target: $variables.multiLevelStatusUpdateSDP,
            });
          }

          const ojDialogStatusOpen = await Actions.callComponentMethod(context, {
            selector: '#oj-dialog-status',
            method: 'open',
          });
        }
        else if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-2') {
          const dsgetSelectedRows = await $functions.dsgetSelectedRows($variables.directSharedTableADP.data, $variables.DSselectedRows);

          $variables.dsStatusUpdateRowsADP.data = dsgetSelectedRows;
          if ($variables.reallocationRequired === 'Y') {

            await Actions.fireDataProviderEvent(context, {
              refresh: null,
              target: $variables.reallocationMultiLevelStatusSDP,
            });

          }
          else {
            await Actions.fireDataProviderEvent(context, {
              refresh: null,
              target: $variables.multiLevelStatusUpdateSDP,
            });
          }

          const ojDialogDsStatusOpen = await Actions.callComponentMethod(context, {
            selector: '#oj-dialog-ds-status',
            method: 'open',
          });
        }
      }

      if (menuId === 'deleteAccount') {
        $variables.retainRunValidationVar = 'N';

        $variables.validationColor = 'runvalidation_orange';
        $variables.fpnDraftSubmitStatus = 'DRAFT';
        if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-1') {


          await Actions.resetVariables(context, {
            variables: [
              '$variables.selectedAccountTableADP',
              '$variables.selectedDataTableADP',
              '$variables.selectedAccount_forDelete',
            ],
          });

          let selectedOutpuandLocationsDelete = await $functions.selectedOutpuandLocationsDelete($variables.temptableADP.data, $variables.selectedADP);

          $variables.selectedAccount_forDelete = selectedOutpuandLocationsDelete.accountCodes;
          $variables.selectedDataTableADP.data = selectedOutpuandLocationsDelete.outputsAndLocations;

          const accountsBySelected = await $functions.getAccountsBySelected($variables.temptableADP.data, $variables.selectedDataTableADP.data);

          $variables.selectManyDeleteADP.data = accountsBySelected;
          const ojDialogDeleteOpen = await Actions.callComponentMethod(context, {
            selector: '#oj-dialog-delete',
            method: 'open',
          });
        }
        else if ($variables.ojTabBar20581860342SelectedItem === 'oj-tab-bar-2058186034-2-tab-2') {
          await Actions.fireDataProviderEvent(context, {
            target: $variables.directSharedTableADP,
            remove: {
              keys: $variables.DSselectedRows,
            },
          });

        }
      }
      if (menuId === 'approvedreject') {

        const reallocationRequestApproveRejectPopupOpen = await Actions.callComponentMethod(context, {
          selector: '#ReallocationRequestApproveRejectPopup',
          method: 'open',
        });

      }
    }
  }

  return MenuMenuActionChain;
});
