define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojarraytreedataprovider',
  'ojs/ojflattenedtreedataproviderview',
], (
  ActionChain,
  Actions,
  ActionUtils,
  ArrayTreeDataProvider,
  FlattenedTreeDataProviderView
) => {
  'use strict';

  class fpSeachActionGroup extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.selectedValue
     * @param {any} params.menuId
     */
    async run(context, { event, selectedValue, menuId }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      if (selectedValue === 'Edit') {
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.financialPlanStatus',
            '$page.variables.sharedCostLovValue',
            '$page.variables.sharedCostTypeId',
            '$page.variables.riskRatingLovValue',
          ],
        });

        $variables.financialplanTab = 'Edit';
        $variables.financialPlanStatus = $variables.getGetfpn_detailsVar.fpn_status;
        $variables.currentFpnCode = $variables.getGetfpn_detailsVar.fpn_code;

        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $variables.treeTableADP,
        });
        console.log("=>menukey" + $variables.getGetfpn_detailsVar.fpn_id);
        // $variables.fpnIdKey = $variables.getGetfpn_detailsVar.fpn_id;

        const response = await Actions.callRest(context, {
          endpoint: 'OICService/getRetrieve',
          uriParams: {
            fpnCode: $variables.getGetfpn_detailsVar.fpn_code,
          },
        });

        // const response = await Actions.callRest(context, {
        //   endpoint: 'pfmGateway/getModifyfpn',
        //   uriParams: {
        //     'p_fpn_code': $variables.getGetfpn_detailsVar.fpn_code,
        //   },
        // });

        const testcode = await $functions.testcode(response.body.items);

        $variables.testVariable = testcode;

        $variables.temptableADP.data = testcode;
        // console.log("testcode"+JSON.stringify(testcode));
        // console.log("tempADP"+JSON.stringify($variables.temptableADP.data));

        const tree = $functions.convertArrayIntoTree($variables.temptableADP.data); // Assuming you exposed this func
        const arrayTreeDP = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
        $variables.arrayTreeDP = arrayTreeDP;  // save if needed
        $variables.dataSource = new FlattenedTreeDataProviderView($variables.arrayTreeDP);

        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $variables.treeTableADP,
        });

        await Actions.callChain(context, {
          chain: 'statusAssign',
        });

        await Actions.callChain(context, {
          chain: 'fpnUpdatePageAccessControl',
          params: {
            'fpn_status': $variables.getGetfpn_detailsVar.fpn_status,
          },
        });

        $variables.tempdirectSharedArray = $variables.testVariable[0].fpn.direct_shared || [];
        $variables.directSharedTableADP.data = $variables.tempdirectSharedArray;
        $variables.indirectSharedArray = $variables.testVariable[0].fpn.indirect_support || [];
        $variables.indirectSharedADP.data = $variables.indirectSharedArray;
        $variables.fpnComment = $variables.testVariable[0].fpn.fpn_comments || '';
        // $variables.riskRatingLovValue = $variables.testVariable[0].fpn.essential_controls || '';
        $variables.riskRatingLovValue = $variables.testVariable[0].fpn.essential_controls === '0%' ? '' : $variables.testVariable[0].fpn.essential_controls || '';
        $variables.headerStatusValue = $variables.testVariable[0].fpn.fpn_status || '';
        const response2 = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getFpnChangelog',
          uriParams: {
            'p_fpn_code': response.body.items[0].fpn.fpn_code,
          },
        });

        $variables.changeLogExportADP.data = response2.body.items;

        // $variables.sharedCostTypeId = $variables.testVariable[0].fpn.indirect_support[0].lookup_type_id;

        // $variables.directSharedArray = response.body.items[0].fpn.direct_shared;
        // $variables.directSharedTableADP.data = $variables.directSharedArray;
        // $variables.indirectSharedArray = response.body.items[0].fpn.indirect_support;
        // $variables.indirectSharedADP.data = $variables.indirectSharedArray;
        // $variables.fpnComment = response.body.items[0].fpn.fpn_comments;
        // $variables.sharedCostTypeId = response.body.items[0].fpn.indirect_support[0].lookup_type_id;

        $variables.genralInfo.operation = response.body.items[0].fpn.operation_name;
        $variables.genralInfo.budgetYear = response.body.items[0].fpn.budget_year;
        $variables.genralInfo.contractCurrency = response.body.items[0].fpn.contract_currency_code;
        $variables.genralInfo.toataloriginalbudget = response.body.items[0].fpn.total_original_budget;
        $variables.genralInfo.partnerName = response.body.items[0].fpn.partner_name;
        $variables.genralInfo.partnerERPSite = response.body.items[0].fpn.partner_site_code;
        $variables.genralInfo.contractNumber = response.body.items[0].fpn.contract_number;
        $variables.genralInfo.totalDirectProgramme = response.body.items[0].fpn.total_direct_programme_cost;
        $variables.genralInfo.totalNegotiatedBudget = response.body.items[0].fpn.total_negotiated_budget;
        $variables.genralInfo.totalDirectShared = response.body.items[0].fpn.total_direct_shared_cost;
        $variables.genralInfo.totalIndirectSupportCost = response.body.items[0].fpn.total_indirect_support_cost;
        $variables.genralInfo.totalPFRExpenses = response.body.items[0].fpn.total_expenses;
        $variables.sharedCostTypeId = response?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.lookup_type_id || '';
        $variables.sharedCostLovValue = response?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.shared_cost || '';
      }

      if (selectedValue === 'Prepayment') {
        const response = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getFpn_prepayments',
          uriParams: {
            'p_fpn_code': $variables.getGetfpn_detailsVar.fpn_code,
          },
        });

        if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Prepayment Create API Load Failed',
            message: response.status + ' - ' + response.statusText,
          });


        }
        else {


          if (response.body.items[0].res === 'N') {
            await Actions.fireNotificationEvent(context, {
              summary: 'Prepayment Create ',
              message: 'Please complete existing prepayment for fpn',
            });

          }
          else {
            const toPrepaymentAddEdit = await Actions.navigateToPage(context, {
              page: 'prepayment-add-edit',
              params: {
                paramStatus: 'Draft',
                ViewEditVar: 'Edit',
                prepaymentDocumentNo: $variables.getGetfpn_detailsVar.fpn_code,
                mode: 'create',
              },
            });
          }

        }
      }

    }
  }

  return fpSeachActionGroup;
});
