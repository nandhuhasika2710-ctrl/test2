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

  class onClickEditButton extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.key 
     * @param {number} params.index 
     * @param {any} params.current 
     */
    async run(context, { key, index, current }) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      if ($application.variables.userRole === 'PARTNER_USER' && current.row.fpn_status === 'Approved') {

        $variables.reallocationfpnDraftSubmitStatus = current.row.operation_name.split('-').pop();
        $variables.reallocationFinancialPlanStatus = current.row.fpn_status;
        $variables.reallocationCurrentFpnCode = current.row.fpn_code;
        // $variables.reallocationCurrentFpnId = key;

        const response5a = await Actions.callRest(context, {
          endpoint: 'pfmGateway/postFpnupdateValidation',
          uriParams: {
            'p_fpn_code': current.row.fpn_code,
          },
        });

        if (response5a.body.status_code === '400') {
          await Actions.fireNotificationEvent(context, {
            summary: response5a.body.responsemessage,
          });

          return;
        }
        else {
          const reallocationPopupOpen = await Actions.callComponentMethod(context, {
            selector: '#reallocationPopup',
            method: 'open',

          });
          return;
        }
      }

      if (($application.variables.userRole === 'SENIOR_PROGRAMME_OFFICER' || $application.variables.userRole === 'JUNIOR_PROGRAMME_OFFICER') && current.row.fpn_status === 'Approved') {

        const response5 = await Actions.callRest(context, {
          endpoint: 'pfmGateway/postFpnupdateValidation',
          uriParams: {
            'p_fpn_code': current.row.fpn_code,
          },
        });

        if (response5.body.status_code === '400') {
          await Actions.fireNotificationEvent(context, {
            summary: response5.body.responsemessage,
          });

          return;
        }
        else {
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
          $variables.financialPlanStatus = current.row.fpn_status;
          $variables.currentFpnCode = current.row.fpn_code;
          $variables.currentPONumber = current.row.po_number;
          $variables.fpnDraftSubmitStatus = current.row.operation_name.split('-').pop();

          await Actions.fireDataProviderEvent(context, {
            refresh: null,
            target: $variables.treeTableADP,
          });



          const response = await Actions.callRest(context, {
            endpoint: 'OICService/getRetrieve',
            uriParams: {
              fpnCode:  $variables.currentFpnCode,
            },
          });

          // const response = await Actions.callRest(context, {
          //   endpoint: 'pfmGateway/getModifyfpn',
          //   uriParams: {
          //     'p_fpn_code': $variables.currentFpnCode,
          //   },
          // });

          const convertFpnPayloadWithId = await $functions.convertFpnPayloadWithId(response.body.items);
          const testcode = await $functions.testcode(convertFpnPayloadWithId);
          $variables.fpnDraftSubmitStatus = response.body.items[0].fpn.draft_submission_status || 'DRAFT';
          $variables.testVariable = testcode;
          console.log("testcode" + JSON.stringify($variables.testVariable));
          $variables.temptableADP.data = testcode;
          const tree = $functions.convertArrayIntoTree($variables.temptableADP.data);
          const arrayTreeDP = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
          $variables.arrayTreeDP = arrayTreeDP;  // save if needed
          $variables.dataSource = new FlattenedTreeDataProviderView($variables.arrayTreeDP);

          await Actions.fireDataProviderEvent(context, {
            refresh: null,
            target: $variables.treeTableADP,
          });
          $variables.fpnDraftSubmitStatus = response.body.items[0].fpn.draft_submission_status || 'DRAFT';
          const response3 = await Actions.callRest(context, {
            endpoint: 'pfmGateway/getUpdateValidationstate',
            uriParams: {
              'doc_type': 'FPN',
              'fpn_code': response.body.items[0].fpn.fpn_code,
            },
          });


          $variables.reallocationRequired = response3.body.items[0].reallocation_required || 'N';
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
              'fpn_status': current.row.fpn_status,
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


      else {
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
        $variables.financialPlanStatus = current.row.fpn_status;
        $variables.currentFpnCode = current.row.fpn_code;
        $variables.currentPONumber = current.row.po_number;
        $variables.fpnDraftSubmitStatus = current.row.operation_name.split('-').pop();

        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $variables.treeTableADP,
        });

        // $variables.fpnIdKey = key;

        const response = await Actions.callRest(context, {
          endpoint: 'OICService/getRetrieve',
          uriParams: {
            fpnCode:  $variables.currentFpnCode,
          },
        });

        // const response = await Actions.callRest(context, {
        //   endpoint: 'pfmGateway/getModifyfpn',
        //   uriParams: {
        //     'p_fpn_code': $variables.currentFpnCode,
        //   },
        // });


        const convertFpnPayloadWithId = await $functions.convertFpnPayloadWithId(response.body.items);
        const testcode = await $functions.testcode(convertFpnPayloadWithId);
        $variables.fpnDraftSubmitStatus = response.body.items[0].fpn.draft_submission_status || 'DRAFT';
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
        $variables.fpnDraftSubmitStatus = response.body.items[0].fpn.draft_submission_status || 'DRAFT';
        const response3 = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getUpdateValidationstate',
          uriParams: {
            'doc_type': 'FPN',
            'fpn_code': response.body.items[0].fpn.fpn_code,
          },
        });


        $variables.reallocationRequired = response3.body.items[0].reallocation_required || 'N';
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
            'fpn_status': current.row.fpn_status,
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
  }

  return onClickEditButton;
});
