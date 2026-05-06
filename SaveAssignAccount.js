define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojarraytreedataprovider',
  'ojs/ojflattenedtreedataproviderview',
  'ojs/ojkeyset'
], (
  ActionChain,
  Actions,
  ActionUtils,
  ArrayTreeDataProvider,
  FlattenedTreeDataProviderView,
  keySet
) => {
  'use strict';

  class SaveAssignAccount extends ActionChain {
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

     
      const response = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getAccounts',
        uriParams: {
          'p_account_type': 'DP',
        },
      });

      const { newData, duplicateErrors } = await $functions.assignAccount($variables.temptableADP.data, $variables.selectedAccountTableADP.data, $variables.selectedDataTableADP.data, response.body.items, $application.variables.userRole);

     

      if (duplicateErrors.length > 0) {
        await Actions.fireNotificationEvent(context, {
          summary: duplicateErrors.join('\n'),
          severity: 'warning',
        });
        return;
      }

      $variables.temptableADP.data = newData;
      const treeData = $functions.convertArrayIntoTree(newData);

      const arrayTreeDP = new ArrayTreeDataProvider(treeData, {
        keyAttributes: 'id',
        keyAttributesScope: 'all'
      });

   
      let expandedKeyArray = Array.isArray($variables.expandedKeys)
        ? [...$variables.expandedKeys]
        : [];

      
      if ($variables.selectedDataTableADP?.data?.length > 0) {
        const addedRow = $variables.selectedDataTableADP.data[0];

        if (addedRow.fpn_location_id) {
          const locationKey = `location-${addedRow.fpn_location_id}`;
          if (!expandedKeyArray.includes(locationKey)) {
            expandedKeyArray.push(locationKey);
          }
        }

        if (addedRow.fpn_output_id) {
          const outputKey = `output-${addedRow.fpn_output_id}`;
          if (!expandedKeyArray.includes(outputKey)) {
            expandedKeyArray.push(outputKey);
          }
        }
      }

      const expandedKeySet = new keySet.ExpandedKeySet(expandedKeyArray);

      const flattenedTreeDP = new FlattenedTreeDataProviderView(arrayTreeDP, {
        expanded: expandedKeySet
      });

      
      $variables.arrayTreeDP = arrayTreeDP;
      $variables.dataSource = flattenedTreeDP;
      $variables.expandedKeys = expandedKeyArray;

      // console.log('Tree updated. Expanded Keys:', expandedKeyArray);

     
      await Actions.callComponentMethod(context, {
        selector: '#oj-dialog-54998388-1',
        method: 'close',
      });

     
      await Actions.resetVariables(context, {
        variables: [
          '$variables.selectedAccount',
          '$variables.selectedAccountTableADP',
          '$variables.selectedDataTableADP',
        ],
      });
    }
  }

  return SaveAssignAccount;
});
