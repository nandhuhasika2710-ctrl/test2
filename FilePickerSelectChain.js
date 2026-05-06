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

  class FilePickerSelectChain extends ActionChain {

    async run(context, { files }) {

      const { $variables, $functions } = context;

      await Actions.callComponentMethod(context, {
        selector: '#progressbar',
        method: 'open',
      });

      await Actions.resetVariables(context, {
        variables: [
          '$variables.excelImportMessages',
          '$variables.excelImportFailedData',
        ],
      });

      try {

        // -------------------------
        // 1. File validation
        // -------------------------
        if (!files || files.length === 0) {
          await Actions.fireNotificationEvent(context, {
            summary: 'No files selected.',
            message: 'Please choose an Excel file to upload before proceeding.',
            type: 'warning',
            displayMode: 'transient',
          });
          return;
        }

        const file = files[0];
        const fileName = file.name.toLowerCase();

        if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Invalid File',
            message: 'Please upload a valid Excel file (.xlsx or .xls).',
            type: 'error',
            displayMode: 'transient'
          });
          return;
        }

        // -------------------------
        // 2. API Calls
        // -------------------------
        const [responseDP, responseDS] = await Promise.all([
          Actions.callRest(context, {
            endpoint: 'pfmGateway/getAccounts',
            uriParams: { p_account_type: 'DP' },
          }),
          Actions.callRest(context, {
            endpoint: 'pfmGateway/getAccounts',
            uriParams: { p_account_type: 'DS' },
          })
        ]);

        const { directProgramme, directShared, headers } =
          await $functions.parseExcelFile(file);
        const normalizedHeaders = (headers || []).map(h =>
          String(h || '').trim().toLowerCase()
        );


        const isFPN =
          normalizedHeaders.includes('fpn');
        console.log("headerssssssssss" + normalizedHeaders);



        // =========================
        // 4. STRICT VALIDATION RULES
        // =========================

        const expectedType = "FPN";
        if (expectedType === 'FPN' && !isFPN) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Invalid File',
            message: 'Please upload a valid FPN Excel file.',
            type: 'error',
          });
          return;
        }


        // -------------------------
        // 3. Validate DP
        // -------------------------
        const {
          validRows: validDP,
          invalidRows: invalidDP
        } = await $functions.validateRowsAgainstTree(
          directProgramme,
          $variables.temptableADP.data,
          responseDP.body.items
        );

        // -------------------------
        // 4. Validate DS
        // -------------------------
        const {
          validRows: validDS,
          invalidRows: invalidDS
        } = await $functions.validateDirectSharedRows(
          directShared,
          responseDS.body.items
        );

        console.log("Valid DS rows:", validDS);
        console.log("Invalid DS rows:", invalidDS);
        // -------------------------
        // 5. STRICT VALIDATION CHECK
        // -------------------------
        const totalInvalid = invalidDP.length + invalidDS.length;
        const totalValid = validDP.length + validDS.length;

        if (totalInvalid > 0) {

          // Download report ONLY for partial failure
          if (totalValid > 0) {
            const failedAll = [...invalidDP, ...invalidDS];
            $variables.excelImportFailedData = failedAll;
          }

          $variables.excelImportMessages.primayMessage = 'Excel Import Failed';
          $variables.excelImportMessages.secondaryMessages = totalValid === 0
            ? 'We could not process this file because all rows contain errors. Please fix the data and try again.'
            : `Some rows could not be processed (${totalInvalid} errors found). Please check the failed report for more details`;

          await Actions.callComponentMethod(context, {
            selector: '#uploaderrordialog',
            method: 'open',
          });

          return; // STOP EXECUTION
        }

        // -------------------------
        // 6. Update DP Tree
        // -------------------------
        const updatedTree = await $functions.importFlatRowsToTree(
          validDP,
          $variables.temptableADP.data,
          responseDP.body.items
        );

        $variables.temptableADP.data = updatedTree;

        const arrayTreeDP = new ArrayTreeDataProvider(
          $functions.convertArrayIntoTree(updatedTree),
          { keyAttributes: 'id', keyAttributesScope: 'all' }
        );

        // Expand keys
        let expandedKeyArray = Array.isArray($variables.expandedKeys)
          ? [...$variables.expandedKeys]
          : [];

        if (validDP.length > 0) {
          const firstRow = validDP[0];

          if (firstRow.fpn_location_id) {
            const locationKey = `location-${firstRow.fpn_location_id}`;
            if (!expandedKeyArray.includes(locationKey)) {
              expandedKeyArray.push(locationKey);
            }
          }

          if (firstRow.fpn_output_id) {
            const outputKey = `output-${firstRow.fpn_output_id}`;
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

        // -------------------------
        // 7. Update DS Table
        // -------------------------
        const existingData = $variables.directSharedTableADP.data || [];

        const updatedData = existingData.map(item => {
          const match = validDS.find(
            row => Number(row.accountCode) === item.account_number
          );

          if (match) {
            return {
              ...item,
              account_line_amount: match.value,
              account_line_comments: match.comments || null,
            };
          }

          return { ...item };
        });

        //  Add NEW rows
        const newRows = validDS
          .filter(row =>
            !existingData.some(
              item => item.account_number === Number(row.accountCode)
            )
          )
          .map(row => ({
            account_number: Number(row.accountCode),
            account_line_amount: row.value,
            account_description: row.accountDescription,
            account_line_comments: row.comments || null
          }));

        $variables.directSharedTableADP.data = [
          ...updatedData,
          ...newRows
        ];


        await Actions.fireDataProviderEvent(context, {
          target: $variables.directSharedTableADP,
          refresh: null,
        });


        await Actions.fireNotificationEvent(context, {
          summary: 'Excel Import Successful',
          message: `Your file was processed successfully. ${validDP.length + validDS.length} records were updated`,
          type: 'success',
        });

      } catch (error) {

        console.error(error);

        await Actions.fireNotificationEvent(context, {
          summary: 'Unexpected Error',
          message: 'We encountered an unexpected issue while processing your file. Please try again or contact support if the issue continues.',
          type: 'error',
        });

      } finally {

        await Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });

      }
    }
  }

  return FilePickerSelectChain;
});