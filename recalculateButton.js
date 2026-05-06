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

  class recalculateButton extends ActionChain {
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      const tempData = $variables.temptableADP?.data || [];
      const fpnData = tempData[0]?.fpn || {};
      const directShared = fpnData.direct_shared?.[0];
      const indirectSupport = fpnData.indirect_support?.[0];

      const fpn_ds_id = directShared?.fpn_ds_id || '';
      const fpn_isc_id = indirectSupport?.fpn_isc_id || '';

      const buildFpnPayload = await $functions.buildFpnPayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID, $application.variables.userInfoObj.UserID, fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'DRAFT', undefined, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);

      // const response = await Actions.callRest(context, {
      //   endpoint: 'pfmGateway/postRecalculatefpn',
      //   body: buildFpnPayload,
      //   contentType: 'application/json',
      //   responseBodyFormat: 'json',
      // });

      // if (!response.ok) {
      //   await Actions.fireNotificationEvent(context, {
      //     summary: 'Recalculation Failed',
      //   });
      //   return;
      // }

      const response = await Actions.callRest(context, {
        endpoint: 'OICService/postRecalcuateFpn',
        body: buildFpnPayload,
      });

      if (!response || !response.body || !response.body.status || response.body.status.toUpperCase() !== 'SUCCESS') {
        // if (!response){
        await Actions.fireNotificationEvent(context, {
          summary: 'Fpn Recalculation Failed',
          message: response.body.error_message || 'There was an error during recalculation. Please try again later.',
          displayMode: 'transient',
        });

        const progressbarClose = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
        return; // Exit if recalculation failed
      }

      console.log('Raw Response Body:', response.body);
      const wrappedPayload = {
        items: (response.body.data.fpn || []).map(item => ({
          fpn: item
        }))
      };
      const convertFpnPayloadWithId = await $functions.convertFpnPayloadWithId(wrappedPayload.items);

      const testcode = await $functions.testcode(convertFpnPayloadWithId);
      // const wrappedADPData = testcode.map(item => ({ fpn: item }));
      // update main data
      // $variables.testVariable = wrappedADPData;
      // $variables.temptableADP.data = wrappedADPData;
      $variables.testVariable = testcode;
      $variables.temptableADP.data = $variables.testVariable;

      //  rebuild tree with expand/collapse preservation
      const treeData = $functions.convertArrayIntoTree($variables.temptableADP.data);
      const arrayTreeDP = new ArrayTreeDataProvider(treeData, {
        keyAttributes: 'id',
        keyAttributesScope: 'all'
      });

      // preserve previously expanded keys
      let expandedKeyArray = Array.isArray($variables.expandedKeys)
        ? [...$variables.expandedKeys]
        : [];

      // optionally auto-expand first updated row (if needed)
      if ($variables.selectedDataTableADP?.data?.length > 0) {
        const selectedRow = $variables.selectedDataTableADP.data[0];

        if (selectedRow.fpn_location_id) {
          const locationKey = `location-${selectedRow.fpn_location_id}`;
          if (!expandedKeyArray.includes(locationKey)) {
            expandedKeyArray.push(locationKey);
          }
        }

        if (selectedRow.fpn_output_id) {
          const outputKey = `output-${selectedRow.fpn_output_id}`;
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

      // update other related variables
      // $variables.tempdirectSharedArray = wrappedADPData[0].fpn.direct_shared;
      // $variables.directSharedTableADP.data = $variables.tempdirectSharedArray;
      // $variables.indirectSharedArray = wrappedADPData[0].fpn.indirect_support;
      // $variables.indirectSharedADP.data = $variables.indirectSharedArray;
      $variables.tempdirectSharedArray = $variables.testVariable[0].fpn.direct_shared || [];
      $variables.directSharedTableADP.data = $variables.tempdirectSharedArray;
      $variables.indirectSharedArray = $variables.testVariable[0].fpn.indirect_support || [];
      $variables.indirectSharedADP.data = $variables.indirectSharedArray;
      $variables.fpnComment = response.body.data.fpn[0].fpn_comments || '';
      $variables.riskRatingLovValue = response.body.data.fpn[0].essential_controls || '';
      $variables.headerStatusValue = response.body.data.fpn[0].fpn_status_code;
      $variables.genralInfo.operation = response.body.data.fpn[0].operation_name;
      $variables.genralInfo.budgetYear = response.body.data.fpn[0].budget_year;
      $variables.genralInfo.contractCurrency = response.body.data.fpn[0].contract_currency_code;
      $variables.genralInfo.toataloriginalbudget = response.body.data.fpn[0].total_original_budget;
      $variables.genralInfo.partnerName = response.body.data.fpn[0].partner_name;
      $variables.genralInfo.partnerERPSite = response.body.data.fpn[0].partner_site_code;
      $variables.genralInfo.contractNumber = response.body.data.fpn[0].contract_number;
      $variables.genralInfo.totalDirectProgramme = response.body.data.fpn[0].total_direct_programme_cost;
      $variables.genralInfo.totalNegotiatedBudget = response.body.data.fpn[0].total_negotiated_budget;
      $variables.genralInfo.totalDirectShared = response.body.data.fpn[0].total_direct_shared_cost;
      $variables.genralInfo.totalIndirectSupportCost = response.body.data.fpn[0].total_indirect_support_cost;
      $variables.genralInfo.totalPFRExpenses = response.body.data.fpn[0].total_expenses;
      // $variables.sharedCostTypeId = response?.body?.fpn?.[0]?.indirect_support?.[0]?.lookup_type_id || '';
      //  $variables.retainRunValidationVar = response.body.fpn[0].fpn.validation_state || 'N';
      //         $variables.fpnDraftSubmitStatus = response.body.fpn[0].fpn.draft_submission_status;
      //         if ($variables.fpnDraftSubmitStatus === 'SUBMIT') {
      //           $variables.disableSubmitButton = true;
      //         } else {
      //           $variables.disableSubmitButton = false;
      //         }
      await Actions.fireNotificationEvent(context, {
        summary: 'Recalculation Successful',
        type: 'confirmation',
      });
    }
  }

  return recalculateButton;
});
