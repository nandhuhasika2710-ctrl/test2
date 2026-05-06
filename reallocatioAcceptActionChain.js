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

  class reallocatioAcceptActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.originalEvent
     */
    async run(context, { event, originalEvent }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      const progressbarOpen = await Actions.callComponentMethod(context, {
        selector: '#progressbar',
        method: 'open',
      });

      const reallocationPopupClose = await Actions.callComponentMethod(context, {
        selector: '#reallocationPopup',
        method: 'close',
      });


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



      // $variables.financialplanTab = 'Edit';
      $variables.financialPlanStatus = $variables.reallocationFinancialPlanStatus;
      $variables.currentFpnCode = $variables.reallocationCurrentFpnCode;
      $variables.fpnDraftSubmitStatus = $variables.reallocationfpnDraftSubmitStatus;



      // $variables.fpnIdKey = $variables.reallocationCurrentFpnId;

      const response = await Actions.callRest(context, {
        endpoint: 'OICService/getRetrieve',
        uriParams: {
          fpnCode: $variables.currentFpnCode,
        },
      });

      //     // const response = await Actions.callRest(context, {
      //     //   endpoint: 'pfmGateway/getModifyfpn',
      //     //   uriParams: {
      //     //     'p_fpn_id': key,
      //     //   },
      //     // });
      const convertFpnPayloadWithId = await $functions.convertFpnPayloadWithId(response.body.items);
      const testcode = await $functions.testcode(convertFpnPayloadWithId);
      $variables.fpnDraftSubmitStatus = response.body.items[0].fpn.draft_submission_status;

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
          'fpn_status': $variables.reallocationFinancialPlanStatus,
        },
      });

      $variables.tempdirectSharedArray = $variables.testVariable[0].fpn.direct_shared || [];
      $variables.directSharedTableADP.data = $variables.tempdirectSharedArray;
      $variables.indirectSharedArray = $variables.testVariable[0].fpn.indirect_support || [];
      // $variables.indirectSharedArray.forEach(item => {
      //   if (item.fpn_isc_id === null) {
      //     item.account_id = 15;  // Default account_id of IS
      //     item.account_number = 611120;  // Default account_number of IS
      //     item.account_description = "Partner - Indirect Support - IS";  // Default description
      //     item.lookup_type_id = 34;  // Default lookup_type_id
      //     item.account = "Indirect Support";  // Default account name
      //     // Leave the remaining fields as null (no changes to them)
      //     item.fpn_isc_id = null;  // Ensure fpn_isc_id remains null
      //     item.shared_cost = null;  // Ensure shared_cost remains null
      //     item.total_cost = null;  // Ensure total_cost remains null
      //   }
      // });
      $variables.indirectSharedADP.data = $variables.indirectSharedArray;
      console.log("indirectSharedADP" + JSON.stringify($variables.indirectSharedADP.data));
      $variables.fpnComment = $variables.testVariable[0].fpn.fpn_comments || '';
      // $variables.riskRatingLovValue = $variables.testVariable[0].fpn.essential_controls || '';
      $variables.riskRatingLovValue = $variables.testVariable[0].fpn.essential_controls === '0%' ? '' : $variables.testVariable[0].fpn.essential_controls || '';
      $variables.headerStatusValue = $variables.testVariable[0].fpn.fpn_status || '';
      const response2 = await Actions.callRest(context, {
        endpoint: 'pfmGateway/getFpnChangelog',
        uriParams: {
          'p_fpn_code': $variables.currentFpnCode,
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
      $variables.sharedCostTypeId = response?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.lookup_type_id ?? 34;
      $variables.sharedCostLovValue = (response?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.shared_cost || '') === ''
        ? 'No PISC:0%'
        : response?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.shared_cost;
      $variables.retainRunValidationVar = response.body.items[0].fpn.validation_state;

      $variables.fpnDraftSubmitStatus = response.body.items[0].fpn.draft_submission_status;
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
      const tempData = $variables.temptableADP?.data || [];

      const fpnData = tempData[0]?.fpn || {};
      const directShared = fpnData.direct_shared?.[0];
      const indirectSupport = fpnData.indirect_support?.[0];

      const fpn_ds_id = directShared?.fpn_ds_id || '';
      const fpn_isc_id = indirectSupport?.fpn_isc_id || '';
      const reallocationPayload = await $functions.buildreallocationPayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID, $application.variables.userInfoObj.UserID, fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'SUBMIT', $variables.retainRunValidationVar, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);
      const addUserOpaPayload = await $functions.addUserOpaPayload($application.variables.userInfoObj.FirstName, $application.variables.userInfoObj.LastName, $application.variables.userInfoObj.FirstName + '' + $application.variables.userInfoObj.LastName, $application.variables.userInfoObj.UserID, $application.variables.opaUserGroup);

      const response8 = await Actions.callRest(context, {
        endpoint: 'opaOic/postPlatformUserprovisioning',
        body: addUserOpaPayload,
      });

      if (!response8.ok) {

        await Actions.fireNotificationEvent(context, {
          summary: 'User Provisioning Service Failed',
          type: 'error',
        });


        const progressbarClose4 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });




        return;
      }

      const opaAccessTokenPayload = await $functions.opaAccessTokenPayload($application.variables.userInfoObj.UserID);

      const response7 = await Actions.callRest(context, {
        endpoint: 'opaOic/postPlatformUserassertionmgmt',
        body: opaAccessTokenPayload,
      });

      if (!response7.ok) {

        const errorMsg =
          response7.body?.error_description ||
          response7.body?.error ||
          response7.statusText;

        await Actions.fireNotificationEvent(context, {
          summary: 'OPA Token Generation Failed',
          message: errorMsg,
          type: 'error',
        });


        const progressbarClose5 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });



        return;
      }

      const formatAsBearerToken = await $functions.formatAsBearerToken(response7.body.access_token);

      $variables.opaAccessToken = formatAsBearerToken;

      const response3 = await Actions.callRest(context, {
        endpoint: 'OPA/postInstances',
        headers: {
          Authorization: $variables.opaAccessToken,
        },
        body: reallocationPayload,
      });

      if (!response3.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Reallocation Request Failed',
        });

        const progressbarClose3 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });

        return;
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Reallocation Request Sent',
          displayMode: 'transient',
          type: 'confirmation',
        });

        const buildFpnStatusPayload = await $functions.buildFpnStatusPayload($variables.currentFpnCode, 'Reallocation Request Sent', $application.variables.userInfoObj.UserID);

        const response4 = await Actions.callRest(context, {
          endpoint: 'pfmGateway/postUpdatefpnstatus',
          body: buildFpnStatusPayload,
        });

        if (!response4.ok) {

          await Actions.fireNotificationEvent(context, {
            summary: 'Error in Updating Status',
          });

          const progressbarClose = await Actions.callComponentMethod(context, {
            selector: '#progressbar',
            method: 'close',
          });

          return;
        } else {
          await Actions.callChain(context, {
            chain: 'fpSearchButtonActionChain',
          });

          const progressbarClose2 = await Actions.callComponentMethod(context, {
            selector: '#progressbar',
            method: 'close',
          });
        }

      }


    }
  }


  return reallocatioAcceptActionChain;
});
