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

  class ButtonActionChain extends ActionChain {

    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

     
      const deleteValidation = await $functions.deleteValidation(
        $variables.temptableADP.data,
        $variables.selectedAccountTableADP.data,
        $variables.selectedDataTableADP.data
      );

      if (!deleteValidation.isValid) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Deletion Not Allowed',
          severity: 'error',
          message: deleteValidation.errors.join('\n'),
        });
        return;
      }

     
      const updatedData = await $functions.removeAccount(
        $variables.temptableADP.data,
        $variables.selectedAccountTableADP.data,
        $variables.selectedDataTableADP.data
      );

      $variables.temptableADP.data = updatedData;

    
      const treeData = $functions.convertArrayIntoTree(updatedData);

      const arrayTreeDP = new ArrayTreeDataProvider(treeData, {
        keyAttributes: 'id',
        keyAttributesScope: 'all'
      });

      
      let expandedKeyArray = Array.isArray($variables.expandedKeys)
        ? [...$variables.expandedKeys]
        : [];

     

      const expandedKeySet = new keySet.ExpandedKeySet(expandedKeyArray);

     
      const flattenedTreeDP = new FlattenedTreeDataProviderView(arrayTreeDP, {
        expanded: expandedKeySet
      });


      $variables.arrayTreeDP = arrayTreeDP;
      $variables.dataSource = flattenedTreeDP;
      $variables.expandedKeys = expandedKeyArray;

      console.log(' Tree updated after delete. Expanded Keys:', expandedKeyArray);

     
      await Actions.callComponentMethod(context, {
        selector: '#oj-dialog-delete',
        method: 'close',
      });

      await Actions.resetVariables(context, {
        variables: [
          '$variables.selectedADP',
          '$variables.selectedAccount_forDelete',
          '$variables.selectedAccountTableADP',
          '$variables.selectedDataTableADP',
        ],
      });
    }
  }

  return ButtonActionChain;
});
