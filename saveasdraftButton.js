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

  class saveasdraftButton extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      const progressbarOpen = await Actions.callComponentMethod(context, {
        selector: '#progressbar',
        method: 'open',
      });

      // Retrieve the data from context
      const tempData = $variables.temptableADP?.data || [];
      const fpnData = tempData[0]?.fpn || {};
      const directShared = fpnData.direct_shared?.[0];
      const indirectSupport = fpnData.indirect_support?.[0];

      const fpn_ds_id = directShared?.fpn_ds_id || '';
      const fpn_isc_id = indirectSupport?.fpn_isc_id || '';
      if ($variables.EssentialcontrolValidation !== 'valid') {
        await Actions.fireNotificationEvent(context, {
          summary: 'The Essential Control Field is mandatory.',
          displayMode: 'transient',
          type: 'error',
        });

        const progressbarClose5 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
        return;
      }

      // Build the payload
      const buildFpnPayload = await $functions.buildFpnPayload(tempData, $variables.directSharedTableADP?.data || [], $variables.indirectSharedADP?.data || [], $variables.sharedCostTypeId || '', $variables.fpnComment || '', $variables.riskRatingLovValue || '', $application.variables.userInfoObj.UserID || '', $application.variables.userInfoObj.UserID || '', fpn_ds_id, fpn_isc_id, $variables.riskRatingTypeId, 'DRAFT', $variables.retainRunValidationVar, $variables.indirectPartnerType, $variables.indirectPartnerPercentage, $application.variables.userRole);
      const validateFpnData = await $functions.validateFpnData(buildFpnPayload);
      if (!validateFpnData.valid) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Validation Failed',
          message: validateFpnData.message,
          displayMode: 'transient',
          type: 'error',
        });
        const progressbarClose = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });

        return;
      }
      // Step 1: Recalculate FPN
      const responseRecalculate = await Actions.callRest(context, {
        endpoint: 'OICService/postRecalcuateFpn',
        body: buildFpnPayload,
      });

      if (!responseRecalculate || !responseRecalculate.body || !responseRecalculate.body.status || responseRecalculate.body.status.toUpperCase() !== 'SUCCESS') {
      //  if (!responseRecalculate){
         await Actions.fireNotificationEvent(context, {
          summary: 'Fpn Save Failed',
          message: responseRecalculate.body.error_message  || 'There was an error during recalculation. Please try again later.',
          displayMode: 'transient',
        });

        const progressbarClose = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
        return; // Exit if recalculation failed
      }

      // const responseRecalculate = await Actions.callRest(context, {
      //   endpoint: 'pfmGateway/postRecalculatefpn',
      //   body: buildFpnPayload,
      // });


      // if (!responseRecalculate.ok) {
      //   await Actions.fireNotificationEvent(context, {
      //     summary: 'Fpn Save Failed',
      //     message: 'There was an error during recalculation. Please try again later.',
      //     displayMode: 'transient',
      //   });
      //   const progressbarClose = await Actions.callComponentMethod(context, {
      //     selector: '#progressbar',
      //     method: 'close',
      //   });
      //   return; // Exit if recalculation failed
      // }



      // Step 2: Save the draft
      const responseSave = await Actions.callRest(context, {
        endpoint: 'OICService/postUpdate',
        uriParams: {
          'p_draft_status': 'DRAFT',
        },
        body: responseRecalculate.body.data,
      }); 

      // const responseSave = await Actions.callRest(context, {
      //   endpoint: 'pfmGateway/putFpnrequest',
      //   uriParams: {
      //     'draft_status': 'DRAFT',
      //   },
      //   body: responseRecalculate.body,
      // });



      // Check if saving the draft failed
      if (!responseSave || !responseSave.body || !responseSave.body.Status ||  responseSave.body.Status.toUpperCase() === 'ERROR' ) {
      // if (responseSave?.body?.response !== 'SUCCESS') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Fpn Save Failed',
          message: responseSave.body.StatusMessage || 'An unexpected error occurred during save.',
          displayMode: 'transient',
        });

        const progressbarClose2 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
        return; // Exit if save failed
      }
      else {

        // Step 3: Success - Display success notification
        await Actions.fireNotificationEvent(context, {
          summary: 'Fpn Saved Successfully',
          displayMode: 'transient',
          type: 'confirmation',
        });

        // Step 5: Retrieve the latest FPN data
        const responseRetrieve = await Actions.callRest(context, {
          endpoint: 'OICService/getRetrieve',
          uriParams: { fpnCode: $variables.currentFpnCode,},
        });

        // const responseRetrieve = await Actions.callRest(context, {
        //   endpoint: 'pfmGateway/getModifyfpn',
        //   uriParams: {
        //     'p_fpn_code': $variables.currentFpnCode,
        //   },
        // });

        // Handle any potential errors during data retrieval
        if (!responseRetrieve.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Data Retrieval Failed',
            message: 'Failed to retrieve the latest data after saving the draft.',
            displayMode: 'transient',
          });

          const progressbarClose3 = await Actions.callComponentMethod(context, {
            selector: '#progressbar',
            method: 'close',
          });
          return;
        }
        const convertFpnPayloadWithId = await $functions.convertFpnPayloadWithId(responseRetrieve.body.items);
        const testcode = await $functions.testcode(convertFpnPayloadWithId);
        $variables.testVariable = testcode;
        $variables.temptableADP.data = testcode;
        $variables.financialPlanStatus = responseRetrieve.body.items[0].fpn.fpn_status_code;
        $variables.fpnDraftSubmitStatus = responseRetrieve.body.items[0].fpn.draft_submission_status;
        // Convert the data into a tree structure
        const tree = $functions.convertArrayIntoTree($variables.temptableADP.data);
        const arrayTreeDP = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
        $variables.arrayTreeDP = arrayTreeDP;
        $variables.dataSource = new FlattenedTreeDataProviderView($variables.arrayTreeDP);

        // Refresh the tree table data provider
        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $variables.treeTableADP,
        });

        // Update financial plan status and trigger other related chains

        if ($variables.fpnDraftSubmitStatus === 'DRAFT') {
          await Actions.callChain(context, {
            chain: 'draftStatusAssign',
          });

        }
        // else if ($variables.fpnDraftSubmitStatus === 'SUBMIT') {

        //   await Actions.callChain(context, {
        //     chain: 'statusAssign',
        //   });
        // }
        await Actions.callChain(context, {
          chain: 'fpnUpdatePageAccessControl',
          params: { 'fpn_status': $variables.financialPlanStatus },
        });

        // Update direct shared and indirect shared data
        $variables.tempdirectSharedArray = $variables.testVariable[0].fpn.direct_shared || [];
        $variables.directSharedTableADP.data = $variables.tempdirectSharedArray;
        $variables.indirectSharedArray = $variables.testVariable[0].fpn.indirect_support || [];
        $variables.indirectSharedADP.data = $variables.indirectSharedArray;
        $variables.fpnComment = $variables.testVariable[0].fpn.fpn_comments || '';
        $variables.riskRatingLovValue = $variables.testVariable[0].fpn.essential_controls || '';
        $variables.headerStatusValue = $variables.testVariable[0].fpn.fpn_status || '';

        // Retrieve and update changelog information
        const responseChangelog = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getFpnChangelog',
          uriParams: {
            'p_fpn_code': $variables.currentFpnCode,
          },
        });

        // Update the changelog data
        if (responseChangelog.ok) {
          $variables.changeLogExportADP.data = responseChangelog.body.items;
        }

        // Update general information
        $variables.genralInfo.operation = responseRetrieve.body.items[0].fpn.operation_name;
        $variables.genralInfo.budgetYear = responseRetrieve.body.items[0].fpn.budget_year;
        $variables.genralInfo.contractCurrency = responseRetrieve.body.items[0].fpn.contract_currency_code;
        $variables.genralInfo.toataloriginalbudget = responseRetrieve.body.items[0].fpn.total_original_budget;
        $variables.genralInfo.partnerName = responseRetrieve.body.items[0].fpn.partner_name;
        $variables.genralInfo.partnerERPSite = responseRetrieve.body.items[0].fpn.partner_site_code;
        $variables.genralInfo.contractNumber = responseRetrieve.body.items[0].fpn.contract_number;
        $variables.genralInfo.totalDirectProgramme = responseRetrieve.body.items[0].fpn.total_direct_programme_cost;
        $variables.genralInfo.totalNegotiatedBudget = responseRetrieve.body.items[0].fpn.total_negotiated_budget;
        $variables.genralInfo.totalDirectShared = responseRetrieve.body.items[0].fpn.total_direct_shared_cost;
        $variables.genralInfo.totalIndirectSupportCost = responseRetrieve.body.items[0].fpn.total_indirect_support_cost;
        $variables.genralInfo.totalPFRExpenses = responseRetrieve.body.items[0].fpn.total_expenses;
        $variables.sharedCostTypeId = responseRetrieve?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.lookup_type_id || '';
        $variables.sharedCostLovValue = responseRetrieve?.body?.items?.[0]?.fpn?.indirect_support?.[0]?.shared_cost || '';

        $variables.retainRunValidationVar = responseRetrieve.body.items[0].fpn.validation_state || 'N';
        $variables.fpnDraftSubmitStatus = responseRetrieve.body.items[0].fpn.draft_submission_status;
        if ($variables.fpnDraftSubmitStatus === 'SUBMIT') {
          $variables.disableSubmitButton = true;
        } else {
          $variables.disableSubmitButton = false;
        }

        await Actions.fireDataProviderEvent(context, {
          target: $variables.commentsSDP,
          refresh: null,
        });

        const progressbarClose4 = await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });
      }
    }
  }

  return saveasdraftButton;
});
