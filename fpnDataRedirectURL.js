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

  class fpnDataRedirectURL extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;
      $variables.currentFpnCode = $application.variables.sepratedFPNCode;

      const response3 = await Actions.callRest(context, {
        endpoint: 'OICService/getRetrieve',
        uriParams: {
          fpnCode: $application.variables.sepratedFPNCode,
        },
      });

      const fpn = response3?.body?.items?.[0]?.fpn;

      if (!fpn) {
        console.error("FPN data missing");
        return;
      }
      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.financialPlanStatus',
          '$page.variables.sharedCostLovValue',
          '$page.variables.sharedCostTypeId',
          '$page.variables.riskRatingLovValue',
          '$variables.validationColor',
          '$variables.financialPlanStatus',
          '$variables.sharedCostLovValue',
          '$variables.sharedCostTypeId',
          '$variables.riskRatingLovValue',
        ],
      });

      $variables.financialplanTab = 'Edit';
      $variables.financialPlanStatus = response3.body.items[0].fpn.fpn_status_code;
      $variables.currentFpnCode = response3.body.items[0].fpn.fpn_code;
      $variables.currentPONumber = response3.body.items[0].fpn.po_number;
      $variables.fpnDraftSubmitStatus = response3.body.items[0].fpn.draft_submission_status;
      $variables.reallocationRequired = response3.body.items[0].fpn.reallocation_required || 'N';
      await Actions.fireDataProviderEvent(context, {
        refresh: null,
        target: $variables.treeTableADP,
      });
      const convertFpnPayloadWithId = await $functions.convertFpnPayloadWithId(response3.body.items);
      const testcode = await $functions.testcode(convertFpnPayloadWithId);
      $variables.testVariable = testcode;
      $variables.temptableADP.data = testcode;
      const tree = $functions.convertArrayIntoTree($variables.temptableADP.data);
      const arrayTreeDP = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
      $variables.arrayTreeDP = arrayTreeDP;  // save if needed
      $variables.dataSource = new FlattenedTreeDataProviderView($variables.arrayTreeDP);

      await Actions.fireDataProviderEvent(context, {
        refresh: null,
        target: $variables.treeTableADP,
      });
      if ($variables.fpnDraftSubmitStatus === 'DRAFT') {
        await Actions.callChain(context, {
          chain: 'draftStatusAssign',
        });

      }
      else if ($variables.fpnDraftSubmitStatus === 'SUBMIT') {

        await Actions.callChain(context, {
          chain: 'statusAssign',
        });
      }



      await Actions.callChain(context, {
        chain: 'fpnUpdatePageAccessControl',
        params: {
          'fpn_status': $variables.financialPlanStatus,
        },
      });





      $variables.tempdirectSharedArray = $variables.testVariable[0].fpn.direct_shared || [];
      $variables.directSharedTableADP.data = $variables.tempdirectSharedArray;
      $variables.indirectSharedArray = $variables.testVariable[0].fpn.indirect_support || [];
      $variables.indirectSharedArray.forEach(item => {

        // item.account_id = 15;  // Default account_id of IS
        item.account_number = 611120;  // Default account_number of IS
        item.account_description = "Partner - Indirect Support - IS";  // Default description
        // item.lookup_type_id = 34;  // Default lookup_type_id
        // item.account = "Indirect Support";  // Default account name
        // Leave the remaining fields as null (no changes to them)
        // item.fpn_isc_id = null;  // Ensure fpn_isc_id remains null
        item.shared_cost = null;  // Ensure shared_cost remains null
        item.total_cost = null;  // Ensure total_cost remains null

      });
      $variables.indirectSharedADP.data = $variables.indirectSharedArray;
      $variables.fpnComment = $variables.testVariable[0].fpn.fpn_comments || '';
      // $variables.riskRating        LovValue = $variables.testVariable[0].fpn.essential_controls || '';
      $variables.riskRatingLovValue = $variables.testVariable[0].fpn.essential_controls || '';
      $variables.headerStatusValue = $variables.testVariable[0].fpn.fpn_status || '';
      const response2 = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getFpnChangelog',
        uriParams: {
          'p_fpn_code': $variables.currentFpnCode,
        },
      });

      $variables.changeLogExportADP.data = response2.body.items;
      $variables.genralInfo.operation = response3.body.items[0].fpn.operation_name;
      $variables.genralInfo.budgetYear = response3.body.items[0].fpn.budget_year;
      $variables.genralInfo.contractCurrency = response3.body.items[0].fpn.contract_currency_code;
      $variables.genralInfo.toataloriginalbudget = response3.body.items[0].fpn.total_original_budget;
      $variables.genralInfo.partnerName = response3.body.items[0].fpn.partner_name;
      $variables.genralInfo.partnerERPSite = response3.body.items[0].fpn.partner_site_code;
      $variables.genralInfo.contractNumber = response3.body.items[0].fpn.contract_number;
      $variables.genralInfo.totalDirectProgramme = response3.body.items[0].fpn.total_direct_programme_cost;
      $variables.genralInfo.totalNegotiatedBudget = response3.body.items[0].fpn.total_negotiated_budget;
      $variables.genralInfo.totalDirectShared = response3.body.items[0].fpn.total_direct_shared_cost;
      $variables.genralInfo.totalIndirectSupportCost = response3.body.items[0].fpn.total_indirect_support_cost;
      $variables.genralInfo.totalPFRExpenses = response3.body.items[0].fpn.total_expenses;
      $variables.sharedCostLovValue = (response3?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.shared_cost || '') === ''
        ? 'No PISC:0%'
        : response3?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.shared_cost;
      $variables.retainRunValidationVar = response3.body.items[0].fpn.validation_state;


      if ($variables.retainRunValidationVar === 'N') {

        $variables.validationColor = 'runvalidation_orange';

      }
      else if ($variables.retainRunValidationVar === 'Y') {

        $variables.validationColor = 'runvalidation_green';

      }
      if ($variables.fpnDraftSubmitStatus === 'SUBMIT') {
        $variables.disableSubmitButton = true;
      } else {
        $variables.disableSubmitButton = false;
      }
    }

  }


  return fpnDataRedirectURL;
});
