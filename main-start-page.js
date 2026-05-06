define(['ojs/ojpagingdataproviderview', 'ojs/ojarraydataprovider', 'knockout', 'ojs/ojarraytreedataprovider', 'ojs/ojflattenedtreedataproviderview', 'ojs/ojknockouttemplateutils'], function (PagingDataProviderView, ArrayDataProvider, ko, ArrayTreeDataProvider, FlattenedTreeDataProviderView, KnockoutTemplateUtils) {
  'use strict';

  const ExcelJS = window.ExcelJS;
  const XLSX = window.XLSX;

  class PageModule {
    constructor() {
      this.dataSource = ko.observable();  // make it a Knockout observable
    }

    searchTablePagination(arg1) {
      return new PagingDataProviderView(new ArrayDataProvider(arg1, { idAttribute: 'fpn_id' }));
    }
    // Build Job Test

    overViewTablePagination(arg1) {
      return new PagingDataProviderView(new ArrayDataProvider(arg1, { idAttribute: 'id' }));
    }

    // isButtonDisabled(userRole, fpnStatus, operationName, isLocked, lockedBy, currentUser, buttonType) {
    //   const role = userRole;
    //   const status = fpnStatus;
    //   const operation = (operationName || "").toLowerCase();

    //   const isPartner = role === "PARTNER_USER";
    //   const isJunior = role === "JUNIOR_PROGRAMME_OFFICER";
    //   const isSenior = role === "SENIOR_PROGRAMME_OFFICER";
    //   const isSeniorPC = role === "SENIOR_PROJECT_CONTROL";
    //   const isJuniorPC = role === "JUNIOR_PROJECT_CONTROL";
    //   const isSuperUser = role === "PFM_SUPERUSER";
    //   const isOfficer =
    //     role === "SENIOR_PROGRAMME_OFFICER" ||
    //     role === "JUNIOR_PROGRAMME_OFFICER";
    //   const isController =
    //     role === "SENIOR_PROJECT_CONTROL" ||
    //     role === "JUNIOR_PROJECT_CONTROL";
    //   const isDraft = operation.includes("draft");
    //   const reallocationRequired = operation.endsWith("-y");
    //   const isSubmit = operation.includes("submit");
    //   if (isController) {
    //     return true;
    //   }
    //   if (isSuperUser) {
    //     return false;
    //   }
    //   if (isLocked === 'Y' && lockedBy && currentUser && lockedBy.toLowerCase() !== currentUser.toLowerCase() && !isPartner) {
    //     return true;
    //   }

    //   if (reallocationRequired) {

    //     // -------- UNDER REVIEW --------
    //     if (status === "Under Review") {
    //       // Only Partner can edit
    //       if (isPartner) return false;
    //       return true;
    //     }

    //     if (status === "Reallocation Request Sent") {
    //       if (isSenior) return true;
    //       if (isJunior) return false;
    //       if (isPartner) return true;
    //       return true;
    //     }
    //     // -------- PROPOSED --------
    //     if (status === "Proposed") {
    //       if (isDraft && isPartner) return false;
    //       if (isSubmit && isJunior) return false;
    //       return true;
    //     }

    //     // -------- APPROVED --------
    //     if (status === "Approved") {
    //       if (isSubmit && (isJunior || isSenior)) return false;
    //       if (isPartner) return false;
    //       return true;
    //     }

    //     // -------- UNDER RESCOPE --------
    //     if (status === "Under Rescope") {
    //       return true;
    //     }

    //     // -------- ENDORSED --------
    //     if (status === "Endorsed") {
    //       if (isDraft && isJunior) return false;
    //       if (isSubmit && isSenior) return false;
    //       return true;
    //     }

    //     // -------- REVISED --------
    //     if (status === "Revised") {
    //       if (isDraft && (isSenior || isJunior)) return false;
    //       if (isSubmit && isPartner) return false;
    //       return true;
    //     }

    //     // -------- AGREED --------
    //     if (status === "Agreed") {
    //       if (isDraft && isSenior) return false;
    //       return true;
    //     }

    //     if (status === "Rejected") {
    //       if (isPartner) return false;
    //       if (isOfficer) return false;
    //       return true;
    //     }

    //     if (status === "Scoped") {
    //       if (isOfficer) return true;
    //       if (isPartner) return false;
    //       return true;
    //     }
    //   }

    //   else {

    //     if (status === "Scoped") {
    //       if (isOfficer) return false;
    //       if (isPartner) return true;
    //       return true;
    //     }
    //     if (status === "Reallocation Request Sent") {
    //       if (isOfficer) return false;
    //       if (isPartner) return true;
    //       return true;
    //     }
    //     if (status === "Proposed") {
    //       if (isDraft && isOfficer) return false;
    //       if (isSubmit && isPartner) return false;
    //       return true;
    //     }

    //     /* ---------- ENDORSED / REVISED ---------- */
    //     if (status === "Endorsed" || status === "Revised") {
    //       if (isDraft && isPartner) return false;
    //       if (isSubmit && isOfficer) return false;
    //       return true;
    //     }

    //     /* ---------- AGREED ---------- */
    //     if (status === "Agreed") {
    //       if (isDraft && isOfficer) return false;
    //       return true;
    //     }

    //     /* ---------- APPROVED / UNDER REVIEW ---------- */
    //     if (status === "Approved" || status === "Under Review") {
    //       if (isSubmit && isPartner) return false;
    //       if (isSubmit && isOfficer) return false;
    //       return true;
    //     }

    //     /* ---------- RESCOPED ---------- */
    //     if (status === "Rescoped") {
    //       if (isOfficer) return false;
    //       return true;
    //     }

    //     if (status === "Rejected") {
    //       if (isOfficer) return false;
    //       return true;
    //     }



    //     return true;
    //   }

    //    if (buttonType === 'lock' || buttonType === 'unlock') {
    //       if (isPartner || status === 'Agreed' || status === 'Approved') {
    //         return true;
    //       }
    //       return result; // also respect existing logic
    //     }

    // }

    isButtonDisabled(userRole, fpnStatus, operationName, isLocked, lockedBy, currentUser, buttonType) {
      const role = userRole;
      const status = fpnStatus;
      const operation = (operationName || "").toLowerCase();

      const isPartner = role === "PARTNER_USER";
      const isJunior = role === "JUNIOR_PROGRAMME_OFFICER";
      const isSenior = role === "SENIOR_PROGRAMME_OFFICER";
      const isSeniorPC = role === "SENIOR_PROJECT_CONTROL";
      const isJuniorPC = role === "JUNIOR_PROJECT_CONTROL";
      const isSuperUser = role === "PFM_SUPERUSER";
      const isOfficer =
        role === "SENIOR_PROGRAMME_OFFICER" ||
        role === "JUNIOR_PROGRAMME_OFFICER";
      const isController =
        role === "SENIOR_PROJECT_CONTROL" ||
        role === "JUNIOR_PROJECT_CONTROL";

      const isDraft = operation.includes("draft");
      const reallocationRequired = operation.endsWith("-y");
      const isSubmit = operation.includes("submit");

      let result = true;



      if (isController) {
        result = true;
      }
      if (
        isSuperUser &&
        (status === "Agreed" || status === "Approved") &&
        isSubmit
      ) {
        return true;
      }
      else if (isSuperUser) {
        result = false;
      }
      else if (
        isLocked === 'Y' &&
        lockedBy &&
        currentUser &&
        lockedBy.toLowerCase() !== currentUser.toLowerCase() &&
        !isPartner
      ) {
        result = true;
      }
      else if (reallocationRequired) {

        if (status === "Under Review") {
          if (isPartner) result = false;
          else result = true;
        }
        else if (status === "Reallocation Request Sent") {
          if (isSenior) result = true;
          else if (isJunior) result = false;
          else if (isPartner) result = true;
          else result = true;
        }
        else if (status === "Proposed") {
          if (isDraft && isPartner) result = false;
          else if (isSubmit && isJunior) result = false;
          else result = true;
        }
        else if (status === "Approved") {
          if (isSubmit && (isJunior || isSenior)) result = false;
          else if (isPartner) result = false;
          else result = true;
        }
        else if (status === "Under Rescope") {
          result = true;
        }
        else if (status === "Endorsed") {
          if (isDraft && isJunior) result = false;
          else if (isSubmit && isSenior) result = false;
          else result = true;
        }
        else if (status === "Revised") {
          if (isDraft && (isSenior || isJunior)) result = false;
          else if (isSubmit && isPartner) result = false;
          else result = true;
        }
        else if (status === "Agreed") {
          if (isDraft && isSenior) result = false;
          else result = true;
        }
        else if (status === "Rejected") {
          if (isPartner) result = false;
          else if (isOfficer) result = false;
          else result = true;
        }
        else if (status === "Scoped") {
          if (isOfficer) result = true;
          else if (isPartner) result = false;
          else result = true;
        }
        else if (status === "Rescoped") {
          if (isJunior) result = false;
          else if (isPartner) result = true;
          else result = true;
        }
      }
      else {

        if (status === "Scoped") {
          if (isOfficer) result = false;
          else if (isPartner) result = true;
          else result = true;
        }
        else if (status === "Reallocation Request Sent") {
          if (isOfficer) result = false;
          else if (isPartner) result = true;
          else result = true;
        }
        else if (status === "Proposed") {
          if (isDraft && isOfficer) result = false;
          else if (isSubmit && isPartner) result = false;
          else result = true;
        }
        else if (status === "Endorsed" || status === "Revised") {
          if (isDraft && isPartner) result = false;
          else if (isSubmit && isOfficer) result = false;
          else result = true;
        }
        else if (status === "Agreed") {
          if (isDraft && isOfficer) result = false;
          else result = true;
        }
        else if (status === "Approved" || status === "Under Review") {
          if (isSubmit && isPartner) result = false;
          else if (isSubmit && isOfficer) result = false;
          else result = true;
        }
        else if (status === "Rescoped") {
          if (isOfficer) result = false;
          else result = true;
        }
        else if (status === "Rejected") {
          if (isOfficer) result = false;
          else result = true;
        }
      }

      if (buttonType === 'lock' || buttonType === 'unlock') {
        if (isPartner || ((status === 'Agreed' || status === 'Approved') && isSubmit)) {
          return true;
        }
        return result;
      }

      // EDIT or default
      return result;
    }

    convertFpnPayloadWithId(input) {

      // Correct format: input = [ { fpn: {...} } ]
      if (!input || !Array.isArray(input) || !input[0]?.fpn) {
        return { items: [] };
      }

      const uuid = () => Math.floor(Math.random() * 900) + 100;

      // Correct access
      const source = input[0].fpn;

      const result = {
        items: [
          {
            fpn: {
              fpn_id: null, // DO NOT GENERATE (DB will create)

              fpn_code: source.fpn_code,
              cost_center: source.cost_center,
              cost_center_name: source.cost_center_name,
              po_number: source.po_number || "",
              fpn_major_version: source.fpn_major_version,
              fpn_minor_version: source.fpn_minor_version,
              operation_name: source.operation_name,
              operation_code: source.operation_code,
              fpn_status_code: source.fpn_status_code,
              total_original_budget: source.total_original_budget,
              budget_year: source.budget_year,
              contract_currency_code: source.contract_currency_code,
              partner_name: source.partner_name,
              partner_site_code: source.partner_site_code,
              partner_number: source.partner_number,
              total_negotiated_budget: source.total_negotiated_budget || null,
              total_direct_programme_cost: source.total_direct_programme_cost || null,
              total_direct_shared_cost: source.total_direct_shared_cost || null,
              total_indirect_support_cost: source.total_indirect_support_cost || null,
              total_expenses: source.total_expenses || 0,
              total_prepayment: 0,
              contract_number: source.contract_number,
              fpn_comments: source.fpn_comments,
              validation_state: source.validation_state,
              active_flag: source.active_flag,
              recalculation_required: source.recalculation_required,
              reallocation_required: source.reallocation_required || "",
              business_unit: source.business_unit || "",
              in_capacity_of: source.in_capacity_of || "",
              award_project_number: source.award_project_number,
              draft_submission_status: source.draft_submission_status,
              budget_flexibility: source.budget_flexibility,
              essential_controls: source.essential_controls,

              // -------------------------------
              // DIRECT SHARED
              // -------------------------------
              direct_shared: (source.direct_shared || []).map((ds) => ({
                fpn_id: null,
                fpn_ds_id: uuid(), // AUTO ID
                account_id: uuid(), // AUTO ID
                account_line_amount: ds.account_line_amount,
                negotiated_amount: ds.negotiated_amount,
                account_line_status_code: ds.account_line_status_code,
                account: ds.account,
                account_description: ds.account_description,
                account_line_comments: ds.account_line_comments
              })),

              // -------------------------------
              // INDIRECT SUPPORT
              // -------------------------------
              indirect_support: (source.indirect_support || []).map((is) => ({
                fpn_isc_id: uuid(), // AUTO ID
                fpn_id: null,
                // lookup_type_id: uuid(), // AUTO ID
                shared_cost: is.shared_cost,
                total_cost: is.total_cost,
                account_id: uuid(), // AUTO ID
                account: is.account,
                account_description: is.account_description,
                partner_type: is.partner_type,
                partner_percentage: is.partner_percentage
              })),

              // -------------------------------
              // OUTPUTS
              // -------------------------------
              outputs: (source.outputs || []).map((op) => {
                const outputId = uuid(); // Generate once per output

                return {
                  fpn_id: null,
                  fpn_output_id: outputId, // AUTO ID
                  fpn_output_code: op.fpn_output_code,
                  output_description: op.output_description,
                  output_total_budget: op.output_total_budget || null,
                  fpn_output_comments: op.fpn_output_comments || "",
                  output_status_code: op.output_status_code,
                  output_total_cost: op.output_total_cost || "",
                  output_direct_programme_cost: op.output_direct_programme_cost || "",
                  output_direct_shared_cost: op.output_direct_shared_cost || "",
                  output_indirect_support_cost: op.output_indirect_support_cost || "",
                  last_baseline: op.last_baseline,
                  total_expenses: op.total_expenses,

                  locations: (op.locations || []).map((loc) => {
                    const locationId = uuid();

                    return {
                      fpn_id: null,
                      fpn_output_id: outputId,
                      fpn_location_id: locationId, // AUTO ID
                      fpn_location_code: loc.fpn_location_code,
                      fpn_output_code: loc.fpn_output_code,
                      output_location_total_cost: loc.output_location_total_cost || "",
                      output_location_original_budget: loc.output_location_original_budget,
                      output_location_direct_programme_cost: loc.output_location_direct_programme_cost || "",
                      output_location_direct_shared_cost: loc.output_location_direct_shared_cost || "",
                      output_location_indirect_support_cost: loc.output_location_indirect_support_cost || "",
                      location_status_code: loc.location_status_code,
                      fpn_location_comments: loc.fpn_location_comments || "",
                      location_description: loc.location_description || "",
                      last_baseline: loc.last_baseline,
                      total_expenses: loc.total_expenses,

                      accounts: (loc.accounts || []).map((acc) => ({
                        fpn_account_id: uuid(), // AUTO ID
                        fpn_id: null,
                        fpn_location_id: locationId,
                        fpn_location_code: acc.fpn_location_code,
                        fpn_output_id: outputId,
                        fpn_output_code: acc.fpn_output_code,
                        account_id: uuid(), // AUTO ID
                        account_line_amount: acc.account_line_amount || 0,
                        account: acc.account,
                        account_description: acc.account_description,
                        account_category: acc.account_category,
                        account_line_comments: acc.account_line_comments || "",
                        account_line_status_code: acc.account_line_status_code || "",
                        total_expenses: acc.total_expenses,
                        last_baseline: acc.last_baseline
                      }))
                    };
                  })
                };
              })
            }
          }
        ]
      };

      return result;
    }


    buildFpnStatusPayload(fpnCode, fpnStatus, userId) {
      return {
        items: [
          {
            fpn_code: fpnCode || "",
            fpn_status: fpnStatus || "",
            last_updated_by: userId || ""
          }
        ]
      };
    }

    getSuspendPayload() {
      return {
        action: "SUSPEND",
        reason: "Suspending for scope change"
      }
    }

    // validateFpnData(fpn) {

    //   for (const output of fpn.outputs || []) {

    //     if (output.lineStatus === 'Revised' && (!output.comments || output.comments.trim() === '')) {
    //       return {
    //         valid: false,
    //         message: `Comments are mandatory for output with code ${output.outputCode} because lineStatus is Revised.`,
    //       };
    //     }

    //     for (const location of output.locations || []) {
    //       if (location.lineStatus === 'Revised' && (!location.comments || location.comments.trim() === '')) {
    //         return {
    //           valid: false,
    //           message: `Comments are mandatory for location ${location.locationCode} because lineStatus is Revised.`,
    //         };
    //       }

    //       for (const account of location.accounts || []) {
    //         if (account.lineStatus === 'Revised' && (!account.comments || account.comments.trim() === '')) {
    //           return {
    //             valid: false,
    //             message: `Comments are mandatory for account ${account.accountDescription} because lineStatus is Revised.`,
    //           };
    //         }
    //         // value must always be present (non-null, non-undefined, non-empty)
    //         if (account.value === null || account.value === undefined || account.value === '') {
    //           return {
    //             valid: false,
    //             message: `Value is mandatory for account ${account.accountDescription}.`,
    //           };
    //         }
    //       }
    //     }
    //   }

    //   return { valid: true };
    // }


    validateFpnData(fpnPayload) {
      console.log("fpnData" + JSON.stringify(fpnPayload));

      const fpn = fpnPayload?.fpn?.[0];

      if (!fpn) {
        return {
          valid: false,
          message: "Invalid FPN payload."
        };
      }

      // ✅ Budget Flexibility Validation
      if (
        fpn.budget_flexibility === null ||
        fpn.budget_flexibility === undefined ||
        String(fpn.budget_flexibility).trim() === ""
      ) {
        return {
          valid: false,
          message: "Budget Flexibility is mandatory."
        };
      }

      for (const output of fpn.outputs || []) {
        for (const location of output.locations || []) {
          for (const account of location.accounts || []) {
            // if (
            //   account.lineStatus === 'Revised' &&
            //   (!account.comments || account.comments.trim() === '')
            // ) {
            //   return {
            //     valid: false,
            //     message: `Comments are mandatory for account ${account.accountDescription} because lineStatus is Revised.`,
            //   };
            // }
            // value must always be present (non-null, non-undefined, non-empty)
            if (
              account.account_line_amount === null ||
              account.account_line_amount === undefined ||
              String(account.account_line_amount).trim() === ""
            ) {
              return {
                valid: false,
                message: `Value is mandatory for account ${account.account_description}.`
              };

            }
          }
        }
      }

      return { valid: true };
    }

    // PDP
    createPDP(overviewArray) {
      return new PagingDataProviderView(new ArrayDataProvider(overviewArray, { idAttribute: 'id' }));
    }
    generateYears() {
      const current = new Date().getFullYear();
      const list = [];
      for (let y = current - 4; y <= current + 1; y++) {
        list.push({
          id: y,
          label: y.toString(),
          code: y
        });
      }
      return list;
    }
    // l
    parseExcelFile(file) {
      return new Promise((resolve, reject) => {
        const rows = {
          directProgramme: [],
          directShared: [],
          headers: []
        };

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // === Direct Programme sheet ===
            const dpSheet = workbook.Sheets["Direct Programme"];
            if (dpSheet) {
              const jsonDP = XLSX.utils.sheet_to_json(dpSheet, { header: 1 });
              rows.headers = jsonDP[0] || [];
              for (let i = 1; i < jsonDP.length; i++) {
                const row = jsonDP[i];
                rows.directProgramme.push({
                  fpnCode: String(row[0] || '').trim(),
                  outputCode: String(row[1] || '').trim(),
                  locationCode: String(row[2] || '').trim(),
                  accountCode: String(row[3] || '').trim(),
                  accountDescription: String(row[4] || '').trim(),
                  value: Number(row[6]) || 0,
                  comments: String(row[7] || '').trim()
                });
              }
            }

            // === Direct Shared sheet ===
            const dsSheet = workbook.Sheets["Direct Shared"];
            if (dsSheet) {
              const jsonDS = XLSX.utils.sheet_to_json(dsSheet, { header: 1 });
              for (let i = 1; i < jsonDS.length; i++) {
                const row = jsonDS[i];
                rows.directShared.push({
                  accountCode: String(row[0] || '').trim(),
                  accountDescription: String(row[1] || '').trim(),
                  value: Number(row[2]) || 0,
                  comments: String(row[3] || '').trim(),
                });
              }
            }

            resolve(rows);
          } catch (err) {
            reject(err);
          }
        };

        fileReader.readAsArrayBuffer(file);
      });
    }
    validateRowsAgainstTree(rows, existingTree, validAccounts = []) {
      console.log("rows" + JSON.stringify(rows));
      console.log("existingTree" + JSON.stringify(existingTree));
      const validRows = [];
      const invalidRows = [];
      const validAccountNumbers = new Set(
        validAccounts.map(acc => String(acc.account_number).trim())
      );
      const locationAccountMap = new Map();

      rows.forEach(row => {
        const failureReasons = [];

        const fpnCode = String(row.fpnCode || '').trim();
        const outputCode = String(row.outputCode || '').trim();
        const locationCode = String(row.locationCode || '').trim();
        const accountCode = String(row.accountCode || '').trim();

        const locationKey = `${fpnCode}__${outputCode}__${locationCode}`;

        // check for duplicate account codes at location level
        if (!locationAccountMap.has(locationKey)) {
          locationAccountMap.set(locationKey, new Set());
        }
        const seenAccounts = locationAccountMap.get(locationKey);

        if (seenAccounts.has(accountCode)) {
          failureReasons.push(`Duplicate Account Code "${accountCode}" under FPN "${fpnCode}" > Output "${outputCode}" > Location "${locationCode}"`);
        } else {
          seenAccounts.add(accountCode);
        }


        // --- Mandatory Field Checks ---
        if (!fpnCode) {
          failureReasons.push('FPN code is required');
        }

        if (!outputCode) {
          failureReasons.push('Output code is required');
        }

        if (!locationCode) {
          failureReasons.push('Location code is required');
        }

        // --- Skip deeper checks if base fields are missing ---
        if (failureReasons.length === 0) {
          // --- FPN code exists ---
          const fpn = existingTree.find(f => f.fpn.fpn_code === fpnCode);
          if (!fpn) {
            failureReasons.push(`FPN code "${fpnCode}" does not exist`);
          }

          // --- Output exists ---
          const output = fpn?.fpn.outputs.find(o => o.outputCode === outputCode);
          if (!output) {
            failureReasons.push(`Output code "${outputCode}" does not exist under FPN "${fpnCode}"`);
          }

          // --- Location exists ---
          const location = output?.locations.find(l => l.locationCode === locationCode);
          if (!location) {
            failureReasons.push(`Location code "${locationCode}" does not exist under Output "${outputCode}"`);
          }

          const matchedAccount = validAccounts.find(acc =>
            String(acc.account_number).trim() === accountCode
          );

          if (!accountCode || !matchedAccount) {
            failureReasons.push(`Account code "${accountCode}" is invalid or does not exist`);
          } else {
            row.accountDescription = matchedAccount.account_description;
          }

          // --- Value check ---
          if (isNaN(row.value) || row.value < 0) {
            failureReasons.push('Value must be a number and not negative');
          }
        }

        // --- Final Classification ---
        if (failureReasons.length === 0) {
          validRows.push(row);
        } else {
          invalidRows.push({
            ...row,
            failureReason: failureReasons.join('; ')
          });
        }
      });

      return { validRows, invalidRows };
    }

    validateDirectSharedRows(rows, validAccounts = []) {
      const validRows = [];
      const invalidRows = [];

      // Create a map for quick lookup: account_number → account_id
      const accountMap = new Map(
        validAccounts.map(acc => [String(acc.account_number).trim(), acc])
      );
      const seenAccounts = new Set();

      rows.forEach((row) => {
        const failureReasons = [];
        const accountCode = String(row.accountCode || '').trim();
        const value = Number(row.value);

        // Find account_id from accountCode
        const matchedAccount = accountMap.get(accountCode);
        if (accountCode && seenAccounts.has(accountCode)) {
          failureReasons.push(`Duplicate account code "${accountCode}" in the uploaded data`);
        }

        if (accountCode) {
          seenAccounts.add(accountCode);
        }

        // Validate account code
        if (!accountCode || !matchedAccount) {
          failureReasons.push(`Account code "${accountCode}" is invalid or not allowed`);
        }

        // Validate value
        if (isNaN(value) || value < 0) {
          failureReasons.push(`Value must be a number and not negative`);
        }

        if (failureReasons.length === 0) {

          validRows.push({
            ...row,
            account_id: matchedAccount.account_id,
            accountDescription: matchedAccount.account_description
          });
        } else {
          invalidRows.push({
            ...row,
            failureReason: failureReasons.join('; '),
          });
        }
      });

      return { validRows, invalidRows };
    }

    generateFailedRowsReport(invalidRows) {
      const worksheet = XLSX.utils.json_to_sheet(invalidRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Failed Rows');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      return URL.createObjectURL(blob);
    }

    downloadReport(url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'failed_import_report.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    async processDirectProgrammeSheet(file) {
      const rows = [];

      if (!file) {
        // console.error("No file provided.");
        return rows;
      }

      // validate extension
      const validExtensions = ["xls", "xlsx"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        // console.error("Invalid file type. Please upload .xls or .xlsx");
        return rows;
      }

      const fileReader = new FileReader();

      return new Promise((resolve, reject) => {
        fileReader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            if (!workbook || workbook.SheetNames.length === 0) {
              // console.error("No sheets found in Excel file.");
              return resolve(rows);
            }

            const sheet = workbook.Sheets["Direct Programme"];
            if (!sheet) {
              // console.error("Sheet 'Direct Programme' not found.");
              return resolve(rows);
            }

            // Convert to JSON (array of rows)
            const jsonSheet = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (jsonSheet.length <= 1) {
              // console.warn("No data rows found.");
              return resolve(rows);
            }

            // Assume row[0] is header → skip
            for (let rowIndex = 1; rowIndex < jsonSheet.length; rowIndex++) {
              const row = jsonSheet[rowIndex];
              if (!row || row.length < 9) continue;

              rows.push({
                fpnCode: row[0],
                outputCode: row[1],
                locationCode: row[2],
                lineStatus: row[3] || null,
                accountCode: row[4],
                accountDescription: row[5],
                baseLine: row[6] || 0,
                value: row[7] || 0,
                comments: row[8] || null
              });
            }

            // console.log("Imported flat rows:", rows);
            resolve(rows);

          } catch (err) {
            // console.error("Error reading Excel:", err);
            reject(err);
          }
        };

        fileReader.readAsArrayBuffer(file);
      });
    }

    importFlatRowsToTree(flatRows, currentTreeData = [], validAccounts = []) {
      const treeTableADP = JSON.parse(JSON.stringify(currentTreeData));

      flatRows.forEach(row => {
        // --- Find existing FPN ---
        const fpnRow = treeTableADP.find(item => item.fpn.fpn_code === row.fpnCode);
        if (!fpnRow) {
          console.warn(`FPN not found: ${row.fpnCode}. Skipping row.`);
          return;
        }

        // --- Find existing Output ---
        const output = fpnRow.fpn.outputs.find(o => o.outputCode === row.outputCode);
        if (!output) {
          console.warn(`Output not found: ${row.outputCode} under FPN ${row.fpnCode}. Skipping row.`);
          return;
        }

        // --- Find existing Location ---
        const location = output.locations.find(l => l.locationCode === row.locationCode);
        if (!location) {
          console.warn(`Location not found: ${row.locationCode} under Output ${row.outputCode}. Skipping row.`);
          return;
        }
        const matchedAccount = validAccounts.find(
          acc => String(acc.account_number).trim() === String(row.accountCode).trim()
        );

        let account = location.accounts.find(
          a => String(a.accountCode).trim() === String(row.accountCode).trim()
        );
        if (!account) {

          account = {
            id: matchedAccount.account_id,
            fpn_location_id: location.fpn_location_id,
            loc: row.locationCode,
            fpn_output_id: output.fpn_output_id,
            outputCode: row.outputCode,
            accountCode: row.accountCode,
            accountDescription: matchedAccount
              ? matchedAccount.account_description
              : (row.accountDescription || "Unknown"),
            value: row.value || 0,
            comments: row.comments || null,
            lineStatus: row.lineStatus || "Proposed"
          };
          location.accounts.push(account);
        } else {

          if (row.accountDescription !== undefined) account.accountDescription = row.accountDescription;
          if (row.value !== undefined) account.value = row.value;
          if (row.comments !== undefined) account.comments = row.comments;
          if (row.lineStatus !== undefined && row.lineStatus !== null) account.lineStatus = row.lineStatus;
        }
      });

      return treeTableADP;
    }

    async processDirectSharedSheet(sheet) {
      const rows = [];

      if (!sheet) return rows;

      // Loop through all rows from index 2 to sheet.rowCount
      for (let rowIndex = 2; rowIndex <= sheet.rowCount; rowIndex++) {
        const row = sheet.getRow(rowIndex);

        rows.push({
          account_number: row.getCell(1).value,
          account_description: row.getCell(2).value,
          account_line_amount: row.getCell(3).value,
          account_negotiated_amount: row.getCell(4).value,
          account_status_code: row.getCell(5).value
        });
      }

      return rows;
    }
    async processIndirectSharedSheet(sheet) {
      const rows = [];

      if (!sheet) return rows;  // Check if sheet is valid

      // Loop through all rows from index 2 to sheet.rowCount
      for (let rowIndex = 2; rowIndex <= sheet.rowCount; rowIndex++) {
        const row = sheet.getRow(rowIndex);  // Use getRow() for each row

        rows.push({
          account_number: row.getCell(1).value,
          account_description: row.getCell(2).value,
          partner_type: row.getCell(3).value,
          partner_percentage: row.getCell(4).value,
          total_value: row.getCell(5).value
        });
      }

      return rows;
    }
    styleHeaderDP(worksheet, rowIndex = 1) {
      worksheet.getRow(rowIndex).eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: [1, 2, 3, 4].includes(colNumber) ? '000000' : '4472C4' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    styleHeaderDs(worksheet, rowIndex = 1) {
      worksheet.getRow(rowIndex).eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
    styleDataRow(row) {
      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: [1, 2, 3, 4].includes(colNumber) ? 'D9D9D9' : 'FFFFFF' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    }

    styleDataRowDs(row) {
      row.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    }

    applyAccountDropdown(cell, dropdownFormula) {
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [dropdownFormula],
        showErrorMessage: true,
        errorTitle: 'Invalid Entry',
        error: 'Please select a valid account number from the dropdown list.'
      };
    }

    populateFPNRows(sheet, fpnData) {
      fpnData.forEach(wrapper => {
        const fpn = wrapper.fpn;
        if (!fpn || !Array.isArray(fpn.outputs)) return;

        const fpnCode = fpn.fpn_code;

        fpn.outputs.forEach(output => {
          const outputCode = output.outputCode || '';
          const baseline = output.baseLine || '';
          const comments = output.comments || '';

          (output.locations || []).forEach(location => {
            const locationCode = location.locationCode;
            const accounts = location.accounts || [];

            if (accounts.length > 0) {
              accounts.forEach(account => {
                const row = sheet.addRow([
                  fpnCode,
                  outputCode,
                  locationCode,
                  account.accountCode || '',
                  account.accountDescription || '',
                  baseline,
                  account.value || '',
                  account.comments || comments || ''
                ]);


                this.styleDataRow(row);
              });
            } else {
              const row = sheet.addRow([
                fpnCode,
                outputCode,
                locationCode,
                '', '', '', baseline, '', comments || ''
              ]);


              this.styleDataRow(row);
            }
          });
        });
      });
    }

    populateDirectSharedRows(sheet, directSharedData) {
      directSharedData.forEach(item => {
        const row = sheet.addRow([
          item.account_number || '',
          item.account_description || '',
          item.account_line_amount || '',
          item.account_line_comments || '',
          // item.account_status_code || ''
        ]);
        this.styleDataRow(row);
      });
    }
    async exportFPNDataToExcel(fpnData, directAccounts, sharedAccounts, directSharedData, fpnCode) {
      // console.log("directSharedData" + JSON.stringify(directSharedData));
      if (!Array.isArray(fpnData) || !Array.isArray(directSharedData)) {
        console.error('Data is not in array format:', { fpnData, directSharedData });
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const headers = ['FPN', 'Output', 'Location', 'Account', 'Account Description', 'Baseline', 'Value', 'Comments'];
      const lastRowNumber = 1000;

      //Direct Programme Sheet
      const sheetDP = workbook.addWorksheet('Direct Programme');
      sheetDP.addRow(headers);
      this.styleHeaderDP(sheetDP);
      this.populateFPNRows(sheetDP, fpnData);

      const directDropdown = `"${directAccounts.map(a => a.account_number).join(',')}"`;
      for (let i = 2; i <= lastRowNumber; i++) {
        this.applyAccountDropdown(sheetDP.getCell(`D${i}`), directDropdown);
      }

      sheetDP.columns.forEach(col => col.width = 25);
      sheetDP.views = [{ state: 'frozen', ySplit: 1 }];

      // Direct Shared Sheet
      const sheetDS = workbook.addWorksheet('Direct Shared');
      sheetDS.addRow(['Account', 'Account Description', 'Value', 'Comments']);
      this.styleHeaderDP(sheetDS);
      this.populateDirectSharedRows(sheetDS, directSharedData);

      const sharedDropdown = `"${sharedAccounts.map(a => a.account_number).join(',')}"`;
      for (let i = 2; i <= lastRowNumber; i++) {
        this.applyAccountDropdown(sheetDS.getCell(`A${i}`), sharedDropdown);
      }

      sheetDS.columns.forEach(col => col.width = 25);
      sheetDS.views = [{ state: 'frozen', ySplit: 1 }];

      // === 3. Export Workbook ===
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fpnCode || 'FPN_DATA'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    }

    processAndModifyPayload(payload, total_value, prepaid, expensed) {
      const translations = {
        'Total Value': total_value,
        'Total Prepayments': prepaid,
        'Total Expensed': expensed,
      };

      if (payload && payload.body && payload.body.items && Array.isArray(payload.body.items)) {
        payload.body.items = payload.body.items.map(item => {
          if (item.total_expenses in translations) {
            item.total_expenses = translations[item.total_expenses];
          }
          return item;
        });
      }

      return payload;
    }
    // Pie chart Payload
    processAndModifyPiePayload(payload, agreed, approved, in_progress) {
      const translations = {
        'Agreed': agreed,
        'Approved': approved,
        'In Progress': in_progress,
      };

      if (payload && payload.body && payload.body.items && Array.isArray(payload.body.items)) {
        payload.body.items = payload.body.items.map(item => {
          if (item.status in translations) {
            item.status = translations[item.status];
          }
          return item;
        });
      }

      return payload;
    }

    currentYears() {
      const current = new Date().getFullYear();
      return current;
    }



    updateTreeDataProvider(programmeData) {
      const tree = this.convertArrayIntoTree(programmeData);
      const arrayTreeDP = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
      this.dataSource(new FlattenedTreeDataProviderView(arrayTreeDP)); // set observable value
    }

    updateTreeDataProviderForRecalculate(programmeData) {
      // console.log("programmeData" + JSON.stringify(programmeData));
      const tree = this.convertArrayIntoTreeForRecalculate(programmeData);
      const arrayTreeDP = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
      this.dataSource(new FlattenedTreeDataProviderView(arrayTreeDP)); // set observable value
    }


    convertArrayIntoTree(programmeData) {
      console.log("programmeData" + JSON.stringify(programmeData));
      const tree = [];
      const uniqueIdPrefix = Date.now(); // Use current time as a unique prefix

      // Guard: check input data
      if (!Array.isArray(programmeData)) {
        return tree;
      }

      programmeData.forEach(item => {
        const outputs = Array.isArray(item?.fpn?.outputs) ? item.fpn.outputs : [];

        outputs.forEach(output => {
          if (!output) return;

          // Stable Output ID
          const outputNode = {
            id: `output-${output.outputCode}`,
            type: 'output',
            name: output.outputDescription ?? '',
            outputCode: output.outputCode ?? '',
            totalCost: output.totalCost ?? 0,
            outputDescription: output.outputDescription ?? '',
            baseLine: output.baseLine ?? null,
            psc: output.psc ?? null,
            ds: output.ds ?? null,
            value: output.value ?? null,
            last_baseline: output.last_baseline ?? null,
            total_expenses: output.total_expenses ?? null,
            comments: output.comments ?? '',
            lineStatus: output.lineStatus ?? '',
            children: [] // Locations
          };

          const locations = Array.isArray(output.locations) ? output.locations : [];

          locations.forEach(location => {
            if (!location) return;

            // Stable Location ID
            const locationNode = {
              id: `location-${output.outputCode}-${location.locationCode}`,
              fpn_output_id: location.fpn_output_id ?? null,
              fpn_location_id: location.fpn_location_id ?? null,
              type: 'location',
              name: location.locationCode ?? '',
              locationCode: location.locationCode ?? '',
              output_code: location.outputCode ?? '',
              totalCost: location.totalCost ?? 0,
              baseLine: location.baseLine ?? null,
              psc: location.psc ?? null,
              ds: location.ds ?? null,
              value: location.value ?? null,
              last_baseline: location.last_baseline ?? null,
              total_expenses: location.total_expenses ?? null,
              comments: location.comments ?? '',
              lineStatus: location.lineStatus ?? '',
              children: [] // Accounts
            };

            const accounts = Array.isArray(location.accounts) ? location.accounts : [];

            accounts.forEach(account => {
              if (!account) return;

              // Stable Account ID
              const accountNode = {
                id: `account-${output.outputCode}-${account.loc}-${account.accountCode}`,
                fpn_account_id: account.id ?? null,
                fpn_location_id: account.fpn_location_id ?? null,
                fpn_output_id: account.fpn_output_id ?? null,
                loc: account.loc ?? null,
                output_code: account.outputCode ?? '',
                type: 'account',
                name: account.accountDescription ?? '',
                accountCode: account.accountCode ?? '',
                accountDescription: account.accountDescription ?? '',
                value: account.value ?? null,
                last_baseline: account.last_baseline ?? null,
                total_expenses: account.total_expenses ?? null,
                comments: account.comments ?? '',
                lineStatus: account.lineStatus ?? ''
              };

              locationNode.children.push(accountNode);
            });

            outputNode.children.push(locationNode);
          });

          tree.push(outputNode);
        });
      });
      console.log("tree" + JSON.stringify(tree));
      return tree;
    }


    convertArrayIntoTreeForRecalculate(programmeData) {
      // console.log("programmeData" + JSON.stringify(programmeData));
      const tree = [];
      const uniqueIdPrefix = Date.now(); // Use current time as a unique prefix

      // Guard: check input data
      if (!Array.isArray(programmeData)) {
        return tree;
      }

      programmeData.forEach(item => {
        const outputs = Array.isArray(item?.fpn?.outputs) ? item.fpn.outputs : [];

        outputs.forEach(output => {
          if (!output) return;
          pa
          // Stable Output ID
          const outputNode = {
            id: `output-${output.outputCode}`,
            type: 'output',
            name: output.outputDescription ?? '',
            outputCode: output.outputCode ?? '',
            outputDescription: output.outputDescription ?? '',
            baseLine: output.baseLine ?? null,
            psc: output.psc ?? null,
            ds: output.ds ?? null,
            value: output.value ?? null,
            last_baseline: output.last_baseline ?? null,
            total_expenses: output.total_expenses ?? null,
            comments: output.comments ?? '',
            lineStatus: output.lineStatus ?? '',
            children: [] // Locations
          };

          const locations = Array.isArray(output.locations) ? output.locations : [];

          locations.forEach(location => {
            if (!location) return;

            // Stable Location ID
            const locationNode = {
              id: `location-${output.outputCode}-${location.locationCode}`,
              fpn_output_id: location.fpn_output_id ?? null,
              fpn_location_id: location.fpn_location_id ?? null,
              type: 'location',
              name: location.locationCode ?? '',
              locationCode: location.locationCode ?? '',
              baseLine: location.baseLine ?? null,
              psc: location.psc ?? null,
              ds: location.ds ?? null,
              value: location.value ?? null,
              last_baseline: location.last_baseline ?? null,
              total_expenses: location.total_expenses ?? null,
              comments: location.comments ?? '',
              lineStatus: location.lineStatus ?? '',
              children: [] // Accounts
            };

            const accounts = Array.isArray(location.accounts) ? location.accounts : [];

            accounts.forEach(account => {
              if (!account) return;

              // Stable Account ID
              const accountNode = {
                id: `account-${output.outputCode}-${account.loc}-${account.accountCode}`,
                fpn_account_id: account.id ?? null,
                fpn_location_id: account.fpn_location_id ?? null,
                fpn_output_id: account.fpn_output_id ?? null,
                loc: account.loc ?? null,
                type: 'account',
                name: account.accountDescription ?? '',
                accountCode: account.accountCode ?? '',
                accountDescription: account.accountDescription ?? '',
                value: account.value ?? null,
                last_baseline: account.last_baseline ?? null,
                total_expenses: account.total_expenses ?? null,
                comments: account.comments ?? '',
                lineStatus: account.lineStatus ?? ''
              };

              locationNode.children.push(accountNode);
            });

            outputNode.children.push(locationNode);
          });

          tree.push(outputNode);
        });
      });
      console.log("tree" + JSON.stringify(tree));
      return tree;
    }

    convertArrayIntoTreeForReallocation(programmeData) {
      // console.log("programmeData" + JSON.stringify(programmeData));
      const tree = [];
      const uniqueIdPrefix = Date.now(); // Use current time as a unique prefix

      // Guard: check input data
      if (!Array.isArray(programmeData)) {
        return tree;
      }

      programmeData.forEach(item => {
        const outputs = Array.isArray(item?.fpn?.outputs) ? item.fpn.outputs : [];

        outputs.forEach(output => {
          if (!output) return;

          // Stable Output ID
          const outputNode = {
            id: `output-${output.fpn_output_id}`,
            type: 'output',
            name: output.outputDescription ?? '',
            outputCode: output.outputCode ?? '',
            outputDescription: output.outputDescription ?? '',
            baseLine: output.baseLine ?? null,
            psc: output.psc ?? null,
            ds: output.ds ?? null,
            value: output.value ?? null,
            last_baseline: output.last_baseline ?? null,
            total_expenses: output.total_expenses ?? null,
            comments: output.comments ?? '',
            lineStatus: output.lineStatus
              ? output.lineStatus.charAt(0).toUpperCase() + output.lineStatus.slice(1).toLowerCase()
              : '',
            children: [] // Locations
          };

          const locations = Array.isArray(output.locations) ? output.locations : [];

          locations.forEach(location => {
            if (!location) return;

            // Stable Location ID
            const locationNode = {
              id: `location-${location.fpn_location_id}`,
              fpn_output_id: location.fpn_output_id ?? null,
              fpn_location_id: location.fpn_location_id ?? null,
              type: 'location',
              name: location.locationCode ?? '',
              locationCode: location.locationCode ?? '',
              baseLine: location.baseLine ?? null,
              psc: location.psc ?? null,
              ds: location.ds ?? null,
              value: location.value ?? null,
              last_baseline: location.last_baseline ?? null,
              total_expenses: location.total_expenses ?? null,
              comments: location.comments ?? '',
              lineStatus: location.lineStatus
                ? location.lineStatus.charAt(0).toUpperCase() + location.lineStatus.slice(1).toLowerCase()
                : '',
              children: [] // Accounts
            };

            const accounts = Array.isArray(location.accounts) ? location.accounts : [];

            accounts.forEach(account => {
              if (!account) return;

              // Stable Account ID
              const accountNode = {
                id: `account-${account.fpn_output_id}-${account.fpn_location_id}-${account.accountCode}`,
                fpn_account_id: account.id ?? null,
                fpn_location_id: account.fpn_location_id ?? null,
                fpn_output_id: account.fpn_output_id ?? null,
                loc: account.loc ?? null,
                type: 'account',
                name: account.accountDescription ?? '',
                accountCode: account.accountCode ?? '',
                accountDescription: account.accountDescription ?? '',
                value: account.value ?? null,
                last_baseline: account.last_baseline ?? null,
                total_expenses: account.total_expenses ?? null,
                comments: account.comments ?? '',
                lineStatus: account.lineStatus
                  ? account.lineStatus.charAt(0).toUpperCase() + account.lineStatus.slice(1).toLowerCase()
                  : ''
              };

              locationNode.children.push(accountNode);
            });

            outputNode.children.push(locationNode);
          });

          tree.push(outputNode);
        });
      });
      // console.log("tree" + JSON.stringify(tree));
      return tree;
    }




    /**
    * Returns the Knockout observable holding the flattened-tree provider
    */
    getTreeDataProvider() {
      return this.dataSource;
    }


    // updateADP(input2, input1) {
    //   let updatedData = JSON.parse(JSON.stringify(input2));

    //   for (const fpnWrapper of updatedData) {
    //     const fpn = fpnWrapper.fpn;
    //     if (!fpn.outputs) continue;

    //     for (const output of fpn.outputs) {
    //       if (output.fpn_output_id != input1.fpn_output_id) continue;

    //       for (const location of output.locations) {
    //         if (location.fpn_location_id != input1.fpn_location_id) continue;

    //         for (let i = 0; i < location.accounts.length; i++) {
    //           let account = location.accounts[i];

    //           // match by id or accountCode
    //           if (
    //             (account.id && account.id == input1.fpn_account_id) ||
    //             account.accountCode == input1.accountCode
    //           ) {
    //             // update value & comments etc.
    //             location.accounts[i] = {
    //               ...account,
    //               ...input1, // merge new fields
    //             };
    //           }
    //         }
    //       }
    //     }
    //   }

    //   return updatedData;
    // }

    updateADP(input2, input1) {
      // Deep clone to AVOID modifying VB variable directly
      console.log("input2" + JSON.stringify(input2));
      console.log("input1" + JSON.stringify(input1));

      const updatedData = JSON.parse(JSON.stringify(input2));

      for (const fpnWrapper of updatedData) {
        const fpn = fpnWrapper.fpn;
        if (!fpn.outputs) continue;

        for (const output of fpn.outputs) {
          if (output.fpn_output_id != input1.fpn_output_id) continue;

          for (const location of output.locations) {
            if (location.fpn_location_id != input1.fpn_location_id) continue;

            for (let i = 0; i < location.accounts.length; i++) {
              let account = location.accounts[i];

              if (
                (account.id && account.id == input1.fpn_account_id) ||
                account.accountCode == input1.accountCode
              ) {
                location.accounts[i] = {
                  ...account,
                  ...input1
                };
                return updatedData;
              }
            }
          }
        }
      }

      return updatedData;
    }


    // selectedOutpuandLocations(adpData, selection) {
    //   console.log("MULTIadpdata" + JSON.stringify(adpData));
    //   console.log("MULTIselection" + JSON.stringify(selection));
    //   let uniqueSet = new Set();
    //   let result = [];

    //   // helper: extract id + type
    //   const parseSelection = (sel) => {
    //     if (typeof sel === "string") {
    //       const parts = sel.split("-");
    //       const id = parseInt(parts[parts.length - 1], 10);
    //       const type = parts[parts.length - 2]; // "output" or "location"
    //       return { id, type };
    //     }
    //     return { id: sel, type: "unknown" };
    //   };

    //   const parsedSelection = selection.map(parseSelection);
    //   const selectedOutputIds = parsedSelection.filter(s => s.type === "output").map(s => s.id);
    //   const selectedLocationIds = parsedSelection.filter(s => s.type === "location").map(s => s.id);

    //   const outputs = (adpData[0]?.fpn?.outputs) || [];

    //   outputs.forEach(output => {
    //     const outputCode = output.outputCode;
    //     const locations = output.locations || [];

    //     // Case 1: If this output is selected
    //     if (selectedOutputIds.includes(output.fpn_output_id)) {
    //       if (locations.length > 0) {
    //         locations.forEach(loc => {
    //           const key = outputCode + "|" + loc.locationCode;
    //           if (!uniqueSet.has(key)) {
    //             uniqueSet.add(key);
    //             result.push({
    //               output: outputCode,
    //               location: loc.locationCode,
    //               fpn_output_id: loc.fpn_output_id,
    //               fpn_location_id: loc.fpn_location_id
    //             });
    //           }
    //         });
    //       } else {
    //         const key = outputCode + "|";
    //         if (!uniqueSet.has(key)) {
    //           uniqueSet.add(key);
    //           result.push({
    //             output: outputCode,
    //             location: "",
    //             fpn_output_id: output.fpn_output_id,
    //             fpn_location_id: null
    //           });
    //         }
    //       }
    //     }

    //     // Case 2: If any specific location under this output is selected
    //     locations.forEach(loc => {
    //       if (selectedLocationIds.includes(loc.fpn_location_id)) {
    //         const key = outputCode + "|" + loc.locationCode;
    //         if (!uniqueSet.has(key)) {
    //           uniqueSet.add(key);
    //           result.push({
    //             output: outputCode,
    //             location: loc.locationCode,
    //             fpn_output_id: loc.fpn_output_id,
    //             fpn_location_id: loc.fpn_location_id
    //           });
    //         }
    //       }
    //     });
    //   });

    //   // Format so output shows only once
    //   let formatted = [];
    //   let lastOutput = null;
    //   result.forEach(item => {
    //     if (item.output === lastOutput) {
    //       formatted.push({ ...item, output: "" });
    //     } else {
    //       formatted.push(item);
    //       lastOutput = item.output;
    //     }
    //   });
    //   console.log("formatted" + JSON.stringify(formatted));
    //   return formatted;
    // }

    // optimized code with account selection


    selectedOutpuandLocationsDelete(adpData, selection) {
      if (!Array.isArray(adpData) || !Array.isArray(selection)) {
        return { outputsAndLocations: [], accountIds: [], accountCodes: [] };
      }

      const outputs = adpData?.[0]?.fpn?.outputs || [];
      if (!outputs.length || !selection.length) return { outputsAndLocations: [], accountIds: [], accountCodes: [] };

      const selectedOutputCodes = new Set();
      const selectedLocations = new Set(); // outputCode|locationCode
      const selectedAccounts = [];

      // 🔹 Step 1: Parse selection strings
      for (const sel of selection) {
        if (typeof sel !== "string") continue;

        const parts = sel.split("-");
        const type = parts[0];

        if (type === "output") {
          selectedOutputCodes.add(parts.slice(1).join("-"));
        } else if (type === "location") {
          const outputCode = parts[1];
          const locationCode = parts.slice(2).join("-");
          selectedLocations.add(`${outputCode}|${locationCode}`);
        } else if (type === "account") {
          const outputCode = parts[1];
          const locationCode = parts.slice(2, -1).join("-");
          const accountCode = Number(parts.at(-1));
          selectedAccounts.push({ outputCode, locationCode, accountCode });
        }
      }

      const result = [];
      const seen = new Set();
      const accountIds = [];
      const accountCodes = [];

      // 🔹 Step 2: Handle outputs & locations
      for (const output of outputs) {
        const { outputCode, locations = [] } = output;

        const hasExplicitLocationForOutput = locations.some(loc =>
          selectedLocations.has(`${outputCode}|${loc.locationCode}`)
        );

        // 1️⃣ Output selected → include all locations if no specific location selected
        if (selectedOutputCodes.has(outputCode) && !hasExplicitLocationForOutput) {
          for (const loc of locations) {
            const key = `${outputCode}|${loc.locationCode}`;
            if (!seen.has(key)) {
              seen.add(key);
              result.push({
                output: outputCode,
                location: loc.locationCode,
                fpn_output_id: output.fpn_output_id,
                fpn_location_id: loc.fpn_location_id
              });
            }
            // collect account IDs & codes
            if (Array.isArray(loc.accounts)) {
              for (const acc of loc.accounts) {
                if (acc.id) accountIds.push(acc.id);
                if (acc.accountCode) accountCodes.push(acc.accountCode);
              }
            }
          }
          continue;
        }

        // 2️⃣ Explicit location selections
        for (const loc of locations) {
          if (selectedLocations.has(`${outputCode}|${loc.locationCode}`)) {
            const key = `${outputCode}|${loc.locationCode}`;
            if (!seen.has(key)) {
              seen.add(key);
              result.push({
                output: outputCode,
                location: loc.locationCode,
                fpn_output_id: output.fpn_output_id,
                fpn_location_id: loc.fpn_location_id
              });
            }
            if (Array.isArray(loc.accounts)) {
              for (const acc of loc.accounts) {
                if (acc.id) accountIds.push(acc.id);
                if (acc.accountCode) accountCodes.push(acc.accountCode);
              }
            }
          }
        }
      }

      // 🔹 Step 3: Account-specific selections
      for (const accSel of selectedAccounts) {
        const output = outputs.find(o => o.outputCode === accSel.outputCode);
        if (!output) continue;

        const loc = output.locations?.find(l => l.locationCode === accSel.locationCode);
        if (!loc) continue;

        const key = `${output.outputCode}|${loc.locationCode}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            output: output.outputCode,
            location: loc.locationCode,
            fpn_output_id: output.fpn_output_id,
            fpn_location_id: loc.fpn_location_id
          });
        }

        // collect only selected account IDs and codes
        if (Array.isArray(loc.accounts)) {
          const selectedAccs = loc.accounts.filter(a => a.accountCode === accSel.accountCode);
          for (const acc of selectedAccs) {
            if (acc.id) accountIds.push(acc.id);
            if (acc.accountCode) accountCodes.push(acc.accountCode);
          }
        }
      }

      // 🔹 Step 4: Format for UI (show output only once)
      let lastOutput = null;
      const formatted = result.map(item => {
        if (item.output === lastOutput) {
          return { ...item, output: "" };
        }
        lastOutput = item.output;
        return item;
      });

      return {
        outputsAndLocations: formatted,
        accountIds,
        accountCodes
      };
    }

    selectedOutpuandLocations(adpData, selection) {
      const outputs = adpData?.[0]?.fpn?.outputs || [];
      if (!outputs.length || !selection.length) return [];

      const selectedOutputCodes = new Set();
      const selectedLocations = new Set(); // outputCode|locationCode
      const selectedAccounts = [];

      // 🔹 Parse selection
      for (const sel of selection) {
        if (typeof sel !== "string") continue;

        const parts = sel.split("-");
        const type = parts[0];

        if (type === "output") {
          selectedOutputCodes.add(parts.slice(1).join("-"));
        }

        if (type === "location") {
          const outputCode = parts[1];
          const locationCode = parts.slice(2).join("-");
          selectedLocations.add(`${outputCode}|${locationCode}`);
        }

        if (type === "account") {
          selectedAccounts.push({
            outputCode: parts[1],
            locationCode: parts.slice(2, -1).join("-"),
            accountCode: parts.at(-1)
          });
        }
      }

      const result = [];
      const seen = new Set();

      // 🔹 Handle output & location selections
      for (const output of outputs) {
        const { outputCode, locations = [] } = output;

        const hasExplicitLocationForOutput = locations.some(loc =>
          selectedLocations.has(`${outputCode}|${loc.locationCode}`)
        );

        // 1️⃣ Output selected AND no specific location → expand all
        if (selectedOutputCodes.has(outputCode) && !hasExplicitLocationForOutput) {
          for (const loc of locations) {
            const key = `${outputCode}|${loc.locationCode}`;
            if (!seen.has(key)) {
              seen.add(key);
              result.push({
                output: outputCode,
                location: loc.locationCode,
                fpn_output_id: output.fpn_output_id,
                fpn_location_id: loc.fpn_location_id
              });
            }
          }
          continue;
        }

        // 2️⃣ Explicit location selection
        for (const loc of locations) {
          if (selectedLocations.has(`${outputCode}|${loc.locationCode}`)) {
            const key = `${outputCode}|${loc.locationCode}`;
            if (!seen.has(key)) {
              seen.add(key);
              result.push({
                output: outputCode,
                location: loc.locationCode,
                fpn_output_id: output.fpn_output_id,
                fpn_location_id: loc.fpn_location_id
              });
            }
          }
        }
      }

      // 🔹 Account selections → collapse to location
      for (const acc of selectedAccounts) {
        const output = outputs.find(o => o.outputCode === acc.outputCode);
        if (!output) continue;

        const loc = output.locations?.find(
          l => l.locationCode === acc.locationCode
        );
        if (!loc) continue;

        const key = `${output.outputCode}|${loc.locationCode}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            output: output.outputCode,
            location: loc.locationCode,
            fpn_output_id: output.fpn_output_id,
            fpn_location_id: loc.fpn_location_id
          });
        }
      }

      // 🔹 Format for UI (show output once)
      let lastOutput = null;
      return result.map(item => {
        if (item.output === lastOutput) {
          return { ...item, output: "" };
        }
        lastOutput = item.output;
        return item;
      });
    }
    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    selectedAccountTable(accountList, selectedIds) {
      let result = [];

      if (!accountList || !selectedIds) {
        return result;
      }

      for (let i = 0; i < accountList.length; i++) {
        let acc = accountList[i];

        for (let j = 0; j < selectedIds.length; j++) {
          if (acc.account_id === selectedIds[j]) {
            result.push({
              id: acc.account_id,
              account_number: acc.account_number,
              account_description: acc.account_description
            });
            break; // stop inner loop once match is found
          }
        }
      }

      return result;
    }




    // assignAccount(adpdata, accountsdata, selectedadp, masteraccounts) {
    //   if (!Array.isArray(adpdata) || adpdata.length === 0 ||
    //     !Array.isArray(accountsdata) || accountsdata.length === 0 ||
    //     !Array.isArray(selectedadp) || selectedadp.length === 0) {
    //     return Array.isArray(adpdata) ? adpdata : [];
    //   }

    //   const newData = JSON.parse(JSON.stringify(adpdata));
    //   const duplicateErrors = [];

    //   selectedadp.forEach(sel => {
    //     const selOutId = Number(sel.fpn_output_id);
    //     const selLocId = Number(sel.fpn_location_id);

    //     if (isNaN(selOutId) || isNaN(selLocId)) return;

    //     newData.forEach(adp => {
    //       const outputs = adp.fpn?.outputs || [];
    //       outputs.forEach(output => {
    //         if (Number(output.fpn_output_id) !== selOutId) return;

    //         const locations = output.locations || [];
    //         locations.forEach(location => {
    //           if (Number(location.fpn_location_id) !== selLocId) return;

    //           if (!Array.isArray(location.accounts)) {
    //             location.accounts = [];
    //           }

    //           accountsdata.forEach(acc => {
    //             const accCode = Number(acc.account_number);
    //             if (!accCode) return;

    //             // Check if account already exists in the same location-output combination
    //             const alreadyExists = location.accounts.some(existing =>
    //               Number(existing.accountCode) === accCode
    //             );

    //             if (alreadyExists) {
    //               // Include both locationCode and outputCode in the error message
    //               duplicateErrors.push(
    //                 `Duplicate account found: ${accCode} already exists in output "${output.outputCode}" and location "${location.locationCode}".`
    //               );
    //               return;
    //             }

    //             // Find the matching master account by account_number
    //             const matchedMaster = masteraccounts.find(master =>
    //               Number(master.account_number) === accCode
    //             );

    //             const newAccount = {
    //               id: matchedMaster?.account_id || (Date.now() + Math.floor(Math.random() * 1000)), // Use master account ID
    //               fpn_output_id: selOutId,
    //               fpn_location_id: selLocId,
    //               outputCode: output.outputCode || "",
    //               loc: location.locationCode || "",
    //               accountCode: accCode,
    //               accountDescription: acc.account_description || "",
    //               comments: "",
    //               value: 0,
    //               lineStatus: "Proposed"
    //             };

    //             location.accounts.push(newAccount);
    //           });
    //           location.accounts.sort((a, b) => a.accountCode - b.accountCode);
    //         });
    //       });
    //     });
    //   });

    //   // Return new data and any duplicate error messages
    //   return { newData, duplicateErrors };
    // }

    // optimized save for add account

    assignAccount(adpdata, accountsdata, selectedadp, masteraccounts, userRole) {
      if (
        !Array.isArray(adpdata) || adpdata.length === 0 ||
        !Array.isArray(accountsdata) || accountsdata.length === 0 ||
        !Array.isArray(selectedadp) || selectedadp.length === 0
      ) {
        return { newData: Array.isArray(adpdata) ? adpdata : [], duplicateErrors: [] };
      }

      // ✅ Clone only the necessary structure — no full deep clone
      const newData = adpdata.map(adp => ({
        ...adp,
        fpn: {
          ...adp.fpn,
          outputs: adp.fpn.outputs?.map(output => ({
            ...output,
            locations: output.locations?.map(location => ({
              ...location,
              accounts: Array.isArray(location.accounts)
                ? [...location.accounts]
                : []
            })) || []
          })) || []
        }
      }));

      const duplicateErrors = [];

      // ✅ Pre-index master accounts
      const masterMap = new Map(masteraccounts.map(m => [Number(m.account_number), m]));

      //  Pre-index outputs and locations for fast access
      const adpMap = new Map();
      for (const adp of newData) {
        const outputs = adp.fpn?.outputs || [];
        for (const output of outputs) {
          const locations = output.locations || [];
          for (const loc of locations) {
            adpMap.set(`${output.fpn_output_id}-${loc.fpn_location_id}`, {
              output,
              loc
            });
          }
        }
      }

      // Loop efficiently
      for (const sel of selectedadp) {
        const selOutId = Number(sel.fpn_output_id);
        const selLocId = Number(sel.fpn_location_id);
        if (isNaN(selOutId) || isNaN(selLocId)) continue;

        const key = `${selOutId}-${selLocId}`;
        const entry = adpMap.get(key);
        if (!entry) continue;

        const { output, loc } = entry;
        const existingSet = new Set(loc.accounts.map(a => Number(a.accountCode)));

        for (const acc of accountsdata) {
          const accCode = Number(acc.account_number);
          if (!accCode) continue;

          if (existingSet.has(accCode)) {
            duplicateErrors.push(
              `Duplicate account: ${accCode} already exists in output "${output.outputCode}" and location "${loc.locationCode}".`
            );
            continue;
          }

          const matchedMaster = masterMap.get(accCode);
          loc.accounts.push({
            id: matchedMaster?.account_id || crypto.randomUUID(),
            fpn_output_id: selOutId,
            fpn_location_id: selLocId,
            outputCode: output.outputCode || "",
            loc: loc.locationCode || "",
            accountCode: accCode,
            accountDescription: acc.account_description || "",
            comments: "",
            value: 0,
            lineStatus: userRole === "PARTNER_USER" ? "Revised" : "Proposed"
          });
          existingSet.add(accCode);
        }
      }

      // ✅ Sort only once per location
      for (const { loc } of adpMap.values()) {
        loc.accounts.sort((a, b) => a.accountCode - b.accountCode);
      }

      return { newData, duplicateErrors };
    }



    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    // updateAccountLineStatus(adpData, selectedData, selectedStatus) {
    //   // deep clone so caller's data isn't mutated
    //   const updated = JSON.parse(JSON.stringify(adpData || []));

    //   selectedData.forEach(sel => {
    //     updated.forEach(wrapper => {
    //       const outputs = wrapper?.fpn?.outputs || [];
    //       outputs.forEach(output => {
    //         if (output.fpn_output_id === sel.fpn_output_id) {
    //           (output.locations || []).forEach(location => {
    //             if (location.fpn_location_id === sel.fpn_location_id) {
    //               (location.accounts || []).forEach(account => {
    //                 // find existing key name (case-insensitive)
    //                 const existingKey = Object.keys(account).find(k => k.toLowerCase() === 'linestatus');

    //                 if (existingKey) {
    //                   // update that exact key (avoids creating a new one)
    //                   account[existingKey] = selectedStatus;
    //                 } else {
    //                   // fallback: create lowercase 'linestatus' if none present
    //                   account.linestatus = selectedStatus;
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       });
    //     });
    //   });

    //   return updated;
    // }

    // optimized update status 

    updateAccountLineStatus(adpData, selectedData, selectedStatus) {
      if (!Array.isArray(adpData) || !Array.isArray(selectedData)) return adpData;

      // Step 1: Build lookup map for O(1) checks
      const selectionMap = {};
      for (let i = 0; i < selectedData.length; i++) {
        const sel = selectedData[i];
        if (sel.fpn_output_id && sel.fpn_location_id) {
          selectionMap[`${sel.fpn_output_id}_${sel.fpn_location_id}`] = true;
        }
      }

      // Step 2: Clone only what we need (avoid full deep clone)
      const updated = adpData.map(wrapper => {
        const clonedWrapper = {
          ...wrapper,
          fpn: {
            ...wrapper.fpn,
            outputs: (wrapper.fpn?.outputs || []).map(output => ({
              ...output,
              locations: (output.locations || []).map(location => {
                const key = `${output.fpn_output_id}_${location.fpn_location_id}`;
                if (!selectionMap[key]) return location; // skip unselected

                // Update accounts only if this location is selected
                const updatedAccounts = (location.accounts || []).map(account => {
                  const existingKey = Object.keys(account).find(
                    k => k.toLowerCase() === "linestatus"
                  );
                  return {
                    ...account,
                    [existingKey || "linestatus"]: selectedStatus,
                  };
                });

                return { ...location, accounts: updatedAccounts };
              }),
            })),
          },
        };

        return clonedWrapper;
      });

      return updated;
    }

    // selectedOutpuandLocationsDelete(adpData, selection) {
    //   // console.log("adpData", JSON.stringify(adpData));
    //   // console.log("selection", JSON.stringify(selection));

    //   // Preserve type so outputId and locationId don't clash
    //   const cleanedSelection = selection.map(sel => {
    //     if (typeof sel === "string" && sel.startsWith("location-")) {
    //       return { type: "location", id: parseInt(sel.replace("location-", ""), 10) };
    //     } else if (typeof sel === "string" && sel.startsWith("output-")) {
    //       return { type: "output", id: parseInt(sel.replace("output-", ""), 10) };
    //     }
    //     return sel;
    //   });

    //   let uniqueSet = new Set();
    //   let result = [];
    //   let accountIds = [];
    //   let accountCodes = [];

    //   const outputs = (adpData[0]?.fpn?.outputs) || [];

    //   outputs.forEach(output => {
    //     const outputCode = output.outputCode;
    //     const locations = output.locations || [];

    //     // Case 1: output selected → include all its locations
    //     if (cleanedSelection.some(s => s.type === "output" && s.id === output.fpn_output_id)) {
    //       if (locations.length > 0) {
    //         locations.forEach(loc => {
    //           const key = outputCode + "|" + loc.locationCode;
    //           if (!uniqueSet.has(key)) {
    //             uniqueSet.add(key);
    //             result.push({
    //               output: outputCode,
    //               location: loc.locationCode,
    //               fpn_output_id: loc.fpn_output_id,
    //               fpn_location_id: loc.fpn_location_id
    //             });

    //             // Collect accounts
    //             if (Array.isArray(loc.accounts)) {
    //               loc.accounts.forEach(acc => {
    //                 if (acc.id) accountIds.push(acc.id);
    //                 if (acc.accountCode) accountCodes.push(acc.accountCode);
    //               });
    //             }
    //           }
    //         });
    //       } else {
    //         // Output without locations
    //         const key = outputCode + "|";
    //         if (!uniqueSet.has(key)) {
    //           uniqueSet.add(key);
    //           result.push({
    //             output: outputCode,
    //             location: "",
    //             fpn_output_id: output.fpn_output_id ?? null,
    //             fpn_location_id: null
    //           });
    //         }
    //       }
    //     }

    //     // Case 2: location selected → include only that location
    //     locations.forEach(loc => {
    //       if (cleanedSelection.some(s => s.type === "location" && s.id === loc.fpn_location_id)) {
    //         const key = outputCode + "|" + loc.locationCode;
    //         if (!uniqueSet.has(key)) {
    //           uniqueSet.add(key);
    //           result.push({
    //             output: outputCode,
    //             location: loc.locationCode,
    //             fpn_output_id: loc.fpn_output_id,
    //             fpn_location_id: loc.fpn_location_id
    //           });

    //           // Collect accounts
    //           if (Array.isArray(loc.accounts)) {
    //             loc.accounts.forEach(acc => {
    //               if (acc.id) accountIds.push(acc.id);
    //               if (acc.accountCode) accountCodes.push(acc.accountCode);
    //             });
    //           }
    //         }
    //       }
    //     });
    //   });

    //   // Format output to avoid repeating same output label
    //   let formatted = [];
    //   let lastOutput = null;

    //   result.forEach(item => {
    //     if (item.output === lastOutput) {
    //       formatted.push({
    //         output: "",
    //         location: item.location,
    //         fpn_output_id: item.fpn_output_id,
    //         fpn_location_id: item.fpn_location_id
    //       });
    //     } else {
    //       formatted.push(item);
    //       lastOutput = item.output;
    //     }
    //   });

    //   return {
    //     outputsAndLocations: formatted,
    //     accountIds: accountIds,
    //     accountCodes: accountCodes
    //   };
    // }

    // optimized code with account selection






    getAccountsBySelected(adpData, selectedData) {
      // console.log("adpdata", JSON.stringify(adpData));
      // console.log("selectedData", JSON.stringify(selectedData));

      if (!Array.isArray(adpData) || adpData.length === 0 ||
        !Array.isArray(selectedData) || selectedData.length === 0) {
        return [];
      }

      let result = [];

      selectedData.forEach(sel => {
        let { fpn_output_id, fpn_location_id } = sel;

        adpData.forEach(adp => {
          if (!adp.fpn || !Array.isArray(adp.fpn.outputs)) return;

          adp.fpn.outputs.forEach(output => {
            if (String(output.fpn_output_id) === String(fpn_output_id) && Array.isArray(output.locations)) {
              output.locations.forEach(loc => {
                if (String(loc.fpn_location_id) === String(fpn_location_id) && Array.isArray(loc.accounts)) {
                  result.push(...loc.accounts);
                }
              });
            }
          });
        });
      });

      // Deduplicate accounts by accountCode + fpn_output_id + fpn_location_id
      let unique = [];
      let seen = new Set();

      result.forEach(acc => {
        let key = `${acc.accountCode}-${acc.fpn_output_id}-${acc.fpn_location_id}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(acc);
        }
      });
      // console.log("unique" + JSON.stringify(unique));
      return unique;
    }


    removeAccount(adpdata, accountsdata, selectedadp) {
      if (!Array.isArray(adpdata) || adpdata.length === 0 ||
        !Array.isArray(selectedadp) || selectedadp.length === 0) {
        return Array.isArray(adpdata) ? adpdata : [];
      }

      const deleteAllAccounts = !Array.isArray(accountsdata) || accountsdata.length === 0;
      const accountsSet = new Set(deleteAllAccounts ? [] : accountsdata.map(acc => Number(acc.account_number)));

      // Build a fast lookup map for selectedadp
      const selectedMap = new Map();
      for (const sel of selectedadp) {
        const outId = Number(sel.fpn_output_id);
        const locId = Number(sel.fpn_location_id);
        if (isNaN(outId) || isNaN(locId)) continue;

        if (!selectedMap.has(outId)) selectedMap.set(outId, new Set());
        selectedMap.get(outId).add(locId);
      }

      // Flattened one-pass filter
      return adpdata.map(fpnObj => {
        const fpn = fpnObj?.fpn;
        if (!fpn || !Array.isArray(fpn.outputs)) return fpnObj;

        const newOutputs = fpn.outputs.map(output => {
          const outId = Number(output?.fpn_output_id);
          if (!selectedMap.has(outId) || !Array.isArray(output.locations)) return output;

          const locSet = selectedMap.get(outId);
          const newLocations = output.locations.map(loc => {
            const locId = Number(loc?.fpn_location_id);
            if (!locSet.has(locId) || !Array.isArray(loc.accounts)) return loc;

            return {
              ...loc,
              accounts: deleteAllAccounts
                ? []
                : loc.accounts.filter(acc => !accountsSet.has(Number(acc.accountCode)))
            };
          });

          return { ...output, locations: newLocations };
        });

        return { ...fpnObj, fpn: { ...fpn, outputs: newOutputs } };
      });
    }



    // deleteValidation(adpdata, accountsdata, selectedadp) {
    //   const errors = [];

    //   if (!Array.isArray(adpdata) || adpdata.length === 0 ||
    //     !Array.isArray(accountsdata) || accountsdata.length === 0 ||
    //     !Array.isArray(selectedadp) || selectedadp.length === 0) {
    //     return { isValid: true, errors: [] }; // No error
    //   }

    //   for (let s = 0; s < selectedadp.length; s++) {
    //     const sel = selectedadp[s];
    //     const selOutId = Number(sel.fpn_output_id);
    //     const selLocId = Number(sel.fpn_location_id);

    //     if (isNaN(selOutId) || isNaN(selLocId)) continue;

    //     for (let f = 0; f < adpdata.length; f++) {
    //       const fpn = adpdata[f]?.fpn;
    //       if (!fpn || !Array.isArray(fpn.outputs)) continue;

    //       const outputs = fpn.outputs;

    //       for (let o = 0; o < outputs.length; o++) {
    //         const output = outputs[o];
    //         if (Number(output.fpn_output_id) !== selOutId) continue;

    //         if (output.lineStatus?.toLowerCase() === 'approved') {
    //           errors.push(`Output "${output.outputCode}" is in 'Approved' status.`);
    //         }

    //         const locations = Array.isArray(output.locations) ? output.locations : [];
    //         for (let l = 0; l < locations.length; l++) {
    //           const loc = locations[l];
    //           if (Number(loc.fpn_location_id) !== selLocId) continue;

    //           if (loc.lineStatus?.toLowerCase() === 'approved') {
    //             errors.push(`Location "${loc.locationCode}" under Output "${output.outputCode}" is in 'Approved' status.`);
    //           }
    //         }
    //       }
    //     }
    //   }

    //   return {
    //     isValid: errors.length === 0,
    //     errors
    //   };
    // }

    // optimized delete validation 

    deleteValidation(adpdata, accountsdata, selectedadp) {
      const errors = [];

      if (!Array.isArray(adpdata) || adpdata.length === 0 ||
        !Array.isArray(accountsdata) || accountsdata.length === 0 ||
        !Array.isArray(selectedadp) || selectedadp.length === 0) {
        return { isValid: true, errors: [] };
      }

      // Step 1: Build a map of outputs and their locations
      const outputMap = new Map();

      for (const fpnItem of adpdata) {
        const fpn = fpnItem?.fpn;
        if (!fpn || !Array.isArray(fpn.outputs)) continue;

        for (const output of fpn.outputs) {
          const outId = Number(output.fpn_output_id);
          if (isNaN(outId)) continue;

          // Map outputId => output object
          const locMap = new Map();
          if (Array.isArray(output.locations)) {
            for (const loc of output.locations) {
              const locId = Number(loc.fpn_location_id);
              if (!isNaN(locId)) locMap.set(locId, loc);
            }
          }

          outputMap.set(outId, { output, locMap });
        }
      }

      // Step 2: Check selected items against the map
      for (const sel of selectedadp) {
        const selOutId = Number(sel.fpn_output_id);
        const selLocId = Number(sel.fpn_location_id);
        if (isNaN(selOutId) || isNaN(selLocId)) continue;

        const outEntry = outputMap.get(selOutId);
        if (!outEntry) continue;

        const { output, locMap } = outEntry;

        if (output.lineStatus?.toLowerCase() === 'approved') {
          errors.push(`Output "${output.outputCode}" is in 'Approved' status.`);
        }

        const loc = locMap.get(selLocId);
        if (loc?.lineStatus?.toLowerCase() === 'approved') {
          errors.push(`Location "${loc.locationCode}" under Output "${output.outputCode}" is in 'Approved' status.`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }


    mapToTemplate(items) {
      if (!items?.length) {
        throw new Error("No data found");
      }

      const fpn = items[0].fpn;

      return {
        // --- HEADER ---
        fpn_code: fpn.fpn_code || "",
        fpn_status: fpn.fpn_status_code || "",
        last_updated_date: new Date().toLocaleDateString("en-GB"),

        // --- GENERAL INFO ---
        operation: fpn.operation_name || "",
        budget_year: fpn.budget_year || "",
        partner_name: fpn.partner_name || "",
        partner_site: fpn.partner_site_code || "",
        contract_currency: fpn.contract_currency_code || "",
        contract_number: fpn.contract_number || "",

        // --- SUMMARY ---
        scoped_budget: fpn.total_original_budget || 0,
        neg_budget: fpn.total_negotiated_budget || 0,
        budget_after_amen: 0,
        expe_to_date: fpn.total_expenses || 0,
        balance_after_amen: 0,

        dp: fpn.total_direct_programme_cost || 0,
        ds: fpn.total_direct_shared_cost || 0,
        pisc: fpn.total_indirect_support_cost || 0,
        pisc_per: (fpn.indirect_support?.[0]?.partner_percentage || 0) + "%",
        ess_con: fpn.essential_controls || "",

        // --- DIRECT SHARED TABLE ---
        direct_shared: (fpn.direct_shared || []).map(item => ({
          account_desc: `${item.account} : ${item.account_description}`,
          value: item.account_line_amount || 0
        })),

        // --- DIRECT PROGRAMME TABLE (3-level nested) ---
        outputs: (fpn.outputs || []).map(output => ({
          output_label: `${output.fpn_output_code}: ${output.output_description}`,

          locations: (output.locations || []).map(loc => ({
            location: loc.fpn_location_code,

            baseline: loc.output_location_original_budget || 0,
            pisc: loc.output_location_indirect_support_cost || 0,
            ds: loc.output_location_direct_shared_cost || 0,
            value: loc.output_location_total_cost || 0,

            accounts: (loc.accounts || []).map(acc => ({
              account_desc: `${acc.account} ${acc.account_description}`,
              value: acc.account_line_amount || 0
            }))
          }))
        })),

        // --- TOTAL ROW ---
        total_baseline: fpn.total_original_budget || 0,
        total_pisc: fpn.total_indirect_support_cost || 0,
        total_ds: fpn.total_direct_shared_cost || 0,
        total_value: fpn.total_negotiated_budget || 0
      };
    }

    docGeneratorFPNPayload(filename, fpnCode, bucketName, nameSpace, prefix, jsonObjectfolderName, templateFolderName, outputFolderName) {
      const filePath = prefix + "/" + jsonObjectfolderName + "/" + filename;
      const outputFilePath = prefix + "/" + outputFolderName + "/" + fpnCode + ".pdf";
      // const outputFilePath = prefix+"/"+subfolder+"/" + fpnCode + ".docx";
      const docPayload = {
        "requestType": "SINGLE",
        "tagSyntax": "DOCGEN_1_0",
        "data": {
          "source": "OBJECT_STORAGE",
          "namespace": nameSpace,
          "bucketName": bucketName,
          "objectName": filePath

        },
        "template": {
          "source": "OBJECT_STORAGE",
          "namespace": nameSpace,
          "bucketName": bucketName,
          "objectName": "PartnerFinancialManagement/Templates/FPN_Template.docx"
          // "objectName": "AssetManagement/Auction_Catalogue_Template1.docx"
        },
        "output": {
          "target": "OBJECT_STORAGE",
          "namespace": nameSpace,
          "bucketName": bucketName,
          "objectName": outputFilePath,
          "contentType": "application/pdf"
          // "contentType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }

      };
      return docPayload;
    }

    toBase64(data, mimeType) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([data], { type: mimeType });
        const reader = new FileReader();

        reader.onloadend = () => {
          const result = reader.result;

          // Remove "data:<mimeType>;base64," prefix
          const base64 = result.split(',')[1];

          resolve(base64);
        };

        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    createDocumentRegisterPayload(documentNumber, title, documentStatus, documentType, author, revisionDate, hasFile, autoNumber, agreementNumber, supplierName, supplierNumber, poNumber, documentName, projectId, content) {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      return {
        DocumentRegister: [
          {
            DocumentNumber: documentNumber || null,
            Revision: null,
            Title: title || null,
            DocumentStatus: documentStatus || null,
            DocumentType: documentType || null,
            Author: null,
            RevisionDate: null,
            HasFile: hasFile || null,
            AutoNumber: autoNumber || null,
            AgreementNumber: agreementNumber || null,
            Implementer: supplierName || null,
            ImplementerNumber: supplierNumber || null,
            PurchaseOrderNumber: null,
            ProjectFinancialReportNumber: null,
            DocumentName: documentName || null,
            ProjectId: projectId || null,
            Content: content || null, // Base64 string
            IntegrationName: null,
            InitiatedFrom: null
          }
        ]
      };
    }

    downloadFile(data, mimeType, filename) {
      const blob = new Blob([data], {
        type: mimeType
      });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
        return;
      }
      let link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      // Firefox: delay revoking the ObjectURL
      setTimeout(function () {
        URL.revokeObjectURL(blob);
      }, 100);
    }



    transformPayload(payload) {
      if (!Array.isArray(payload) || payload.length === 0) return { fpn: [] };
      // If payload is array with a single item that already contains `fpn` object,
      // return `{ fpn: [ <that fpn object> ] }` without touching inner arrays.
      if (payload.length === 1) {
        const item = payload[0];
        return { fpn: [item.fpn ? item.fpn : item] };
      }
      // fallback: multiple items -> make fpn array of their `fpn` (or items)
      return { fpn: payload.map(i => (i && i.fpn ? i.fpn : i)) };
    }


    // to update ds table

    dsupdateAdpData(adp, currentRowObj) {
      if (!adp || !adp.data || !Array.isArray(adp.data)) {
        // console.error("Invalid ADP object");
        return;
      }

      // Get existing ADP data
      let data = adp.data;

      // Find index of the row with matching account_id
      let index = data.findIndex(row => row.account_id === currentRowObj.account_id);

      if (index !== -1) {
        // Update only that row (merge old row + new values)
        data[index] = {
          ...data[index],
          ...currentRowObj
        };

        // Push updated data back to ADP so VBCS detects change
        adp.data = [...data];
      } else {
        // console.warn("No matching row found for account_id:", currentRowObj.account_id);
      }

      return adp.data;
    }

    selectedDSAccountTable(accountList, selectedIds) {
      let result = [];

      if (!accountList || !selectedIds) {
        return result;
      }

      for (let i = 0; i < accountList.length; i++) {
        let acc = accountList[i];

        for (let j = 0; j < selectedIds.length; j++) {
          if (acc.account_number === selectedIds[j]) {
            // Push the entire row object
            result.push({ ...acc });
            break; // stop inner loop once match is found
          }
        }
      }

      return result;
    }

    // DS -> To update status for selected Rows

    dsUpdateStatus(adp1Data, adp2Data, newStatus) {
      if (!Array.isArray(adp1Data) || !Array.isArray(adp2Data) || typeof newStatus !== "string") {
        return adp2Data;
      }

      // Collect all account_ids from adp1
      const accountIds = adp1Data.map(row => row.account_id);

      // Update only the matching rows in adp2
      return adp2Data.map(row => {
        if (accountIds.includes(row.account_id)) {
          return { ...row, account_status_code: newStatus };
        }
        return row;
      });
    }

    // DS -> To get selected rows

    dsgetSelectedRows(accountList, selectedIds) {
      if (!Array.isArray(accountList) || !Array.isArray(selectedIds)) {
        return [];
      }

      return accountList.filter(row => selectedIds.includes(row.account_id));
    }



    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    buildFpnPayload(payload, directSharedInput = [], indirectSupportInput = [], shared_cost, fpn_comments, riskcreating, lastUpdatedBy, createdBy, fpnDsId, fpnIscId, riskRatingTypeId, status, validationRequired, indirectPartnerType, indirectPartnerPercentage, userCurrentRole) {
      console.log("finalpayload" + JSON.stringify(payload));
      console.log("directSharedInput" + JSON.stringify(directSharedInput));
      console.log("indirectSupportInput" + JSON.stringify(indirectSupportInput));
      if (!Array.isArray(payload) || payload.length === 0) {
        return { fpn: [] };
      }

      // Use first object since your input is an array with one root object
      const fpnData = payload[0].fpn;

      let seqId = 1585; // starting ID for fpn_account_id (adjust as needed)

      // Map outputs and locations (unchanged)
      const outputs = fpnData.outputs.map(output => ({
        // fpn_id: fpnData.fpn_id,
        // fpn_output_id: output.fpn_output_id,
        fpn_output_code: output.outputCode,
        output_description: output.outputDescription,
        output_total_budget: output.baseLine,
        output_total_cost: output.totalCost || 0,
        last_baseline: output.last_baseline,
        total_expenses: output.total_expenses,
        fpn_output_comments: output.comments,
        output_status_code: output.lineStatus,
        output_direct_programme_cost: output.value,
        output_direct_shared_cost: output.ds,
        output_indirect_support_cost: output.psc,
        last_updated_by: lastUpdatedBy || "",
        locations: output.locations.map(location => ({
          // fpn_id: fpnData.fpn_id,
          // fpn_location_id: location.fpn_location_id,
          fpn_location_code: location.locationCode,
          // fpn_output_id: location.fpn_output_id,
          output_location_total_cost: location.totalCost || 0,
          fpn_output_code: location.outputCode,
          last_baseline: location.last_baseline,
          total_expenses: location.total_expenses,
          location_description: location.location_description,
          output_location_original_budget: location.baseLine,
          output_location_direct_programme_cost: location.value,
          output_location_direct_shared_cost: location.ds,
          output_location_indirect_support_cost: location.psc,
          location_status_code: location.lineStatus,
          fpn_location_comments: location.comments,
          last_updated_by: lastUpdatedBy || "",
          accounts: (location.accounts || []).map(acc => ({
            // fpn_id: fpnData.fpn_id,
            // fpn_location_id: acc.fpn_location_id,
            fpn_location_code: acc.loc,
            // fpn_output_id: acc.fpn_output_id,
            fpn_output_code: acc.outputCode,
            // fpn_account_id: seqId++, // auto-increment ID
            // account_id: acc.id,
            account_line_amount: acc.value,
            account: acc.accountCode,
            last_baseline: acc.last_baseline,
            total_expenses: acc.total_expenses,
            account_category: acc.account_category,
            account_description: acc.accountDescription,
            account_line_comments: acc.comments,
            account_line_status_code: acc.lineStatus,
            created_by: createdBy || "",
            last_updated_by: lastUpdatedBy || ""
          }))
        }))
      }));

      // Build final object
      return {
        fpn: [
          {
            // fpn_id: fpnData.fpn_id,
            fpn_code: fpnData.fpn_code,
            cost_center: fpnData.cost_center,
            cost_center_name: fpnData.cost_center_name,
            fpn_major_version: fpnData.fpn_major_version,
            fpn_minor_version: fpnData.fpn_minor_version,
            budget_flexibility: riskRatingTypeId || '',
            validation_state: fpnData.validation_state,
            active_flag: fpnData.active_flag,
            operation_name: fpnData.operation_name,
            operation_code: fpnData.operation_code,
            fpn_status_code: fpnData.fpn_status,
            total_original_budget: fpnData.total_original_budget,
            contract_currency_code: fpnData.contract_currency_code,
            partner_name: fpnData.partner_name,
            partner_number: fpnData.partner_number,
            partner_site_code: fpnData.partner_site_code,
            total_negotiated_budget: fpnData.total_negotiated_budget,
            total_direct_programme_cost: fpnData.total_direct_programme_cost,
            total_direct_shared_cost: fpnData.total_direct_shared_cost,
            total_indirect_support_cost: fpnData.total_indirect_support_cost,
            total_expenses: fpnData.total_expenses,
            contract_number: fpnData.contract_number,
            po_number: fpnData.po_number || '',
            fpn_comments: fpn_comments,
            budget_year: fpnData.budget_year,
            last_updated_by: lastUpdatedBy || "",
            total_prepayment: fpnData.total_prepayment,
            recalculation_required: status,
            validation_state: validationRequired || "",
            reallocation_required: fpnData.reallocation_required || "",
            business_unit: fpnData.business_unit || "",
            in_capacity_of: userCurrentRole || "TESTER",
            award_project_number: fpnData.award_project_number || "",
            essential_controls: riskcreating || "",
            draft_submission_status: status || "",
            created_by: createdBy || "",

            // ✅ Only updated part
            direct_shared: (directSharedInput.length > 0 ? directSharedInput : (fpnData.direct_shared || []))
              .map(ds => ({
                // fpn_id: fpnData.fpn_id,
                // fpn_ds_id: fpnDsId,
                // account_id: ds.account_id,
                account_line_amount: ds.account_line_amount,
                negotiated_amount: ds.account_negotiated_amount,
                account_line_status_code: ds.account_status_code,
                account: ds.account_number,
                account_description: ds.account_description,
                account_line_comments: ds.account_line_comments,
                created_by: createdBy || "",
                last_updated_by: lastUpdatedBy || ""
              })),

            indirect_support: (indirectSupportInput.length > 0 ? indirectSupportInput : (fpnData.indirect_support || []))
              .map(is => ({
                // fpn_isc_id: fpnIscId,
                // account_id: is.account_id,
                total_cost: is.total_value,
                shared_cost: is.shared_cost,
                account: is.account_number,
                account_description: is.account_description,
                // lookup_type_id: shared_cost,
                partner_type: indirectPartnerType || "",
                partner_percentage: indirectPartnerPercentage,
                created_by: createdBy || "",
                last_updated_by: lastUpdatedBy || ""
              })),

            outputs
          }
        ]
      };
    }

    buildreallocationPayload(payload, directSharedInput = [], indirectSupportInput = [], shared_cost, fpn_comments, riskcreating, lastUpdatedBy, createdBy, fpnDsId, fpnIscId, riskRatingTypeId, status, validationRequired, indirectPartnerType, indirectPartnerPercentage, userCurrentRole) {
      if (!Array.isArray(payload) || payload.length === 0) {
        return {
          params: {
            applicationName: "PartnerFinancialManagmentApplication",
            processName: "FinancialPlanUpdateProcessforReallocation"
          },
          dataObject: { inputData: {} }
        };
      }

      const fpnData = payload[0].fpn;

      let seqId = 1585;

      const outputs = fpnData.outputs.map(output => ({
        // fpn_id: fpnData.fpn_id,
        // fpn_output_id: output.fpn_output_id,
        fpn_output_code: output.outputCode,
        output_description: output.outputDescription,
        output_total_budget: output.baseLine,
        output_total_cost: output.totalCost || 0,
        last_baseline: output.last_baseline,
        total_expenses: output.total_expenses,
        fpn_output_comments: output.comments,
        output_status_code: output.lineStatus,
        output_direct_programme_cost: output.value,
        output_direct_shared_cost: output.ds,
        output_indirect_support_cost: output.psc,
        last_updated_by: lastUpdatedBy || "",
        locations: output.locations.map(location => ({
          // fpn_id: fpnData.fpn_id,
          // fpn_location_id: location.fpn_location_id,
          fpn_location_code: location.locationCode,
          // fpn_output_id: location.fpn_output_id,
          output_location_total_cost: location.totalCost || 0,
          fpn_output_code: location.outputCode,
          last_baseline: location.last_baseline,
          total_expenses: location.total_expenses,
          location_description: location.location_description,
          output_location_original_budget: location.baseLine,
          output_location_direct_programme_cost: location.value,
          output_location_direct_shared_cost: location.ds,
          output_location_indirect_support_cost: location.psc,
          location_status_code: location.lineStatus,
          fpn_location_comments: location.comments,
          last_updated_by: lastUpdatedBy || "",
          accounts: (location.accounts || []).map(acc => ({
            // fpn_id: fpnData.fpn_id,
            // fpn_location_id: acc.fpn_location_id,
            fpn_location_code: acc.loc,
            // fpn_output_id: acc.fpn_output_id,
            fpn_output_code: acc.outputCode,
            // fpn_account_id: seqId++, // auto-increment ID
            // account_id: acc.id,
            account_line_amount: acc.value,
            account: acc.accountCode,
            last_baseline: acc.last_baseline,
            total_expenses: acc.total_expenses,
            account_category: acc.account_category,
            account_description: acc.accountDescription,
            account_line_comments: acc.comments,
            account_line_status_code: acc.lineStatus,
            created_by: createdBy || "",
            last_updated_by: lastUpdatedBy || ""
          }))
        }))
      }));



      // Final InputData object
      const inputData = {
        // fpn_id: fpnData.fpn_id,
        fpn_code: fpnData.fpn_code,
        cost_center: fpnData.cost_center,
        cost_center_name: fpnData.cost_center_name,
        fpn_major_version: fpnData.fpn_major_version,
        fpn_minor_version: fpnData.fpn_minor_version,
        budget_flexibility: fpnData.budget_flexibility || "",
        validation_state: fpnData.validation_state,
        active_flag: fpnData.active_flag,
        operation_name: fpnData.operation_name,
        operation_code: fpnData.operation_code,
        fpn_status_code: fpnData.fpn_status,
        total_original_budget: fpnData.total_original_budget,
        contract_currency_code: fpnData.contract_currency_code,
        partner_name: fpnData.partner_name,
        partner_number: fpnData.partner_number,
        partner_site_code: fpnData.partner_site_code,
        total_negotiated_budget: fpnData.total_negotiated_budget,
        total_direct_programme_cost: fpnData.total_direct_programme_cost,
        total_direct_shared_cost: fpnData.total_direct_shared_cost,
        total_indirect_support_cost: fpnData.total_indirect_support_cost,
        total_expenses: fpnData.total_expenses,
        contract_number: fpnData.contract_number,
        po_number: fpnData.po_number || "",
        fpn_comments: fpn_comments,
        budget_year: fpnData.budget_year,
        last_updated_by: lastUpdatedBy || "",
        total_prepayment: fpnData.total_prepayment,
        recalculation_required: status,
        validation_state: validationRequired || "",
        reallocation_required: fpnData.reallocation_required || "",
        business_unit: fpnData.business_unit || "",
        in_capacity_of: userCurrentRole || "",
        award_project_number: fpnData.award_project_number || "",
        essential_controls: riskcreating || "",
        draft_submission_status: status || "",
        created_by: createdBy || "",

        direct_shared:
          (directSharedInput.length > 0
            ? directSharedInput
            : fpnData.direct_shared || []
          ).map(ds => ({
            // fpn_id: fpnData.fpn_id,
            // fpn_ds_id: fpnDsId,
            // account_id: ds.account_id,
            account_line_amount: ds.account_line_amount,
            negotiated_amount: ds.account_negotiated_amount,
            account_line_status_code: ds.account_status_code,
            account: ds.account_number,
            account_description: ds.account_description,
            account_line_comments: ds.account_line_comments,
            created_by: createdBy || "",
            last_updated_by: lastUpdatedBy || ""
          })),

        indirect_support:
          (indirectSupportInput.length > 0
            ? indirectSupportInput
            : fpnData.indirect_support || []
          ).map(is => ({
            // fpn_isc_id: fpnIscId,
            // account_id: is.account_id,
            total_cost: is.total_value,
            shared_cost: is.shared_cost,
            account: is.account_number,
            account_description: is.account_description,
            // lookup_type_id: shared_cost,
            partner_type: indirectPartnerType || "",
            partner_percentage: indirectPartnerPercentage,
            created_by: createdBy,
            last_updated_by: lastUpdatedBy
          })),

        outputs
      };

      return {
        params: {
          applicationName: "PartnerFinancialManagmentApplication",
          processName: "FinancialPlanUpdateProcessforReallocation"
        },
        dataObject: {
          inputData
        }
      };
    }

    buildreallocationChangeScopePayload(payload, directSharedInput = [], indirectSupportInput = [], shared_cost, fpn_comments, riskcreating, lastUpdatedBy, createdBy, fpnDsId, fpnIscId, riskRatingTypeId, status, validationRequired, indirectPartnerType, indirectPartnerPercentage, userCurrentRole) {
      if (!Array.isArray(payload) || payload.length === 0) {
        return {
          params: {
            applicationName: "PartnerFinancialManagmentApplication",
            processName: "FinancialPlanUpdateProcessforScopeChange"
          },
          dataObject: { input: {} }
        };
      }

      const fpnData = payload[0].fpn;

      let seqId = 1585;

      const outputs = fpnData.outputs.map(output => ({
        // fpn_id: fpnData.fpn_id,
        // fpn_output_id: output.fpn_output_id,
        fpn_output_code: output.outputCode,
        output_description: output.outputDescription,
        output_total_budget: output.baseLine,
        output_total_cost: output.totalCost || 0,
        last_baseline: output.last_baseline,
        total_expenses: output.total_expenses,
        fpn_output_comments: output.comments,
        output_status_code: output.lineStatus,
        output_direct_programme_cost: output.value,
        output_direct_shared_cost: output.ds,
        output_indirect_support_cost: output.psc,
        last_updated_by: lastUpdatedBy || "",
        locations: output.locations.map(location => ({
          // fpn_id: fpnData.fpn_id,
          // fpn_location_id: location.fpn_location_id,
          fpn_location_code: location.locationCode,
          // fpn_output_id: location.fpn_output_id,
          output_location_total_cost: location.totalCost || 0,
          fpn_output_code: location.outputCode,
          last_baseline: location.last_baseline,
          total_expenses: location.total_expenses,
          location_description: location.location_description,
          output_location_original_budget: location.baseLine,
          output_location_direct_programme_cost: location.value,
          output_location_direct_shared_cost: location.ds,
          output_location_indirect_support_cost: location.psc,
          location_status_code: location.lineStatus,
          fpn_location_comments: location.comments,
          last_updated_by: lastUpdatedBy || "",
          accounts: (location.accounts || []).map(acc => ({
            // fpn_id: fpnData.fpn_id,
            // fpn_location_id: acc.fpn_location_id,
            fpn_location_code: acc.loc,
            // fpn_output_id: acc.fpn_output_id,
            fpn_output_code: acc.outputCode,
            // fpn_account_id: seqId++, // auto-increment ID
            // account_id: acc.id,
            account_line_amount: acc.value,
            account: acc.accountCode,
            last_baseline: acc.last_baseline,
            total_expenses: acc.total_expenses,
            account_category: acc.account_category,
            account_description: acc.accountDescription,
            account_line_comments: acc.comments,
            account_line_status_code: acc.lineStatus,
            created_by: createdBy || "",
            last_updated_by: lastUpdatedBy || ""
          }))
        }))
      }));



      // Final InputData object
      const inputData = {
        // fpn_id: fpnData.fpn_id,
        fpn_code: fpnData.fpn_code,
        cost_center: fpnData.cost_center,
        cost_center_name: fpnData.cost_center_name,
        fpn_major_version: fpnData.fpn_major_version,
        fpn_minor_version: fpnData.fpn_minor_version,
        budget_flexibility: riskRatingTypeId || "",
        validation_state: fpnData.validation_state,
        active_flag: fpnData.active_flag,
        operation_name: fpnData.operation_name,
        operation_code: fpnData.operation_code,
        fpn_status_code: fpnData.fpn_status,
        total_original_budget: fpnData.total_original_budget,
        contract_currency_code: fpnData.contract_currency_code,
        partner_name: fpnData.partner_name,
        partner_number: fpnData.partner_number,
        partner_site_code: fpnData.partner_site_code,
        total_negotiated_budget: fpnData.total_negotiated_budget,
        total_direct_programme_cost: fpnData.total_direct_programme_cost,
        total_direct_shared_cost: fpnData.total_direct_shared_cost,
        total_indirect_support_cost: fpnData.total_indirect_support_cost,
        total_expenses: fpnData.total_expenses,
        contract_number: fpnData.contract_number,
        po_number: fpnData.po_number || "",
        fpn_comments: fpn_comments,
        budget_year: fpnData.budget_year,
        last_updated_by: lastUpdatedBy || "",
        total_prepayment: fpnData.total_prepayment,
        recalculation_required: status,
        validation_state: validationRequired || "",
        reallocation_required: fpnData.reallocation_required || "",
        business_unit: fpnData.business_unit || "",
        in_capacity_of: userCurrentRole || "TESTER",
        award_project_number: fpnData.award_project_number || "",
        essential_controls: riskcreating || "",
        draft_submission_status: status || "",
        created_by: createdBy || "",

        direct_shared:
          (directSharedInput.length > 0
            ? directSharedInput
            : fpnData.direct_shared || []
          ).map(ds => ({
            // fpn_id: fpnData.fpn_id,
            // fpn_ds_id: fpnDsId,
            // account_id: ds.account_id,
            account_line_amount: ds.account_line_amount,
            negotiated_amount: ds.account_negotiated_amount,
            account_line_status_code: ds.account_status_code,
            account: ds.account_number,
            account_description: ds.account_description,
            account_line_comments: ds.account_line_comments,
            created_by: createdBy || "",
            last_updated_by: lastUpdatedBy || ""
          })),

        indirect_support:
          (indirectSupportInput.length > 0
            ? indirectSupportInput
            : fpnData.indirect_support || []
          ).map(is => ({
            // fpn_isc_id: fpnIscId,
            // account_id: is.account_id,
            total_cost: is.total_value,
            shared_cost: is.shared_cost,
            account: is.account_number,
            account_description: is.account_description,
            // lookup_type_id: shared_cost,
            partner_type: indirectPartnerType || "",
            partner_percentage: indirectPartnerPercentage,
            created_by: createdBy,
            last_updated_by: lastUpdatedBy
          })),

        outputs
      };

      return {
        params: {
          applicationName: "PartnerFinancialManagmentApplication",
          processName: "FinancialPlanUpdateProcessforScopeChange"
        },
        dataObject: {
          input: inputData
        }
      };
    }

    maxLengthValidator(value) {
      if (value && value.length > 250) {
        throw new Error("Maximum 250 characters allowed.");
      }
      return true;
    }


    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    mergeAccounts(adpData, accountADP, userRole) {
      if (!Array.isArray(adpData)) adpData = [];
      if (!Array.isArray(accountADP)) accountADP = [];

      // Collect all account numbers already present in adpData
      const existingNumbers = new Set(adpData.map(acc => acc.account_number));

      accountADP.forEach(acc => {
        if (!existingNumbers.has(acc.account_number)) {
          adpData.push({
            account_description: acc.account_description,
            account_linecomments: acc.account_linecomments,
            account_id: acc.account_id,
            account_line_amount: 0,             // default if not provided
            account_negotiated_amount: null,      // default if not provided
            account_number: acc.account_number,
            account_status_code: userRole === "PARTNER_USER" ? "Revised" : "Proposed"    // or whatever default you want
          });
        }
      });
      adpData.sort((a, b) => a.account_number - b.account_number);

      return adpData;
    }

    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    mergeAccountIndirect(adpData, accountADP) {
      if (!Array.isArray(adpData)) adpData = [];
      if (!Array.isArray(accountADP)) accountADP = [];

      // Collect all account numbers already present in adpData
      const existingNumbers = new Set(adpData.map(acc => acc.account_number));

      accountADP.forEach(acc => {
        if (!existingNumbers.has(acc.account_number)) {
          adpData.push({
            account_description: acc.account_description,
            account_id: acc.account_id,
            account_number: acc.account_number,
            total_value: acc.total_value,
            partner_percentage: acc.partner_percentage,
            partner_type: acc.partner_type // or default if needed
          });
          existingNumbers.add(acc.account_number); // prevent duplicates if multiple in accountADP
        }
      });

      // Always return the merged array
      return adpData;
    }

    claimTaskPayload(claimDetails, fpn_code) {
      let items = [];
      let payload = {
        "items": items
      };
      let obj = {};
      // obj.fpn_id = fpn_id;
      obj.fpn_code = fpn_code;
      obj.instance_id = claimDetails.instance_id || '';
      obj.task_id = claimDetails.task_id || '';
      obj.activity_instance_id = claimDetails.activity_instance_id || '';
      obj.locked_by = claimDetails.locked_by;
      obj.unlocked_by = claimDetails.unlocked_by;
      obj.is_locked = claimDetails.is_locked;

      items.push(obj);
      // console.log(payload);
      return payload;
    }
    // test code
    testcode(input) {
      // console.log("input: " + JSON.stringify(input));

      const renameRules = [
        { key: "fpn_status_code", rename: "fpn_status" },
        { key: "fpn_output_code", parentMatches: ["outputs"], rename: "outputCode" },
        { key: "output_description", rename: "outputDescription" },
        { key: "output_total_budget", rename: "baseLine" },
        { key: "fpn_output_comments", rename: "comments" },
        { key: "output_status_code", rename: "lineStatus" },
        { key: "output_direct_programme_cost", rename: "value" },
        { key: "output_direct_shared_cost", rename: "ds" },
        { key: "output_indirect_support_cost", rename: "psc" },
        { key: "fpn_location_code", parentMatches: ["accounts"], rename: "loc" },
        { key: "fpn_location_code", parentMatches: ["locations"], rename: "locationCode" },
        { key: "output_location_original_budget", rename: "baseLine" },
        { key: "output_total_cost", rename: "totalCost" },
        { key: "output_location_total_cost", parentMatches: ["locations"], rename: "totalCost" },
        { key: "output_location_direct_programme_cost", rename: "value" },
        { key: "output_location_direct_shared_cost", rename: "ds" },
        { key: "output_location_indirect_support_cost", rename: "psc" },
        { key: "location_status_code", rename: "lineStatus" },
        { key: "fpn_location_comments", rename: "comments" },
        { key: "negotiated_amount", parentMatches: ["direct_shared"], rename: "account_negotiated_amount" },
        { key: "account_id", parentMatches: ["accounts"], rename: "id" },
        { key: "account_line_amount", parentMatches: ["accounts"], rename: "value" },
        { key: "account", parentMatches: ["accounts"], rename: "accountCode" },
        { key: "account_description", parentMatches: ["accounts"], rename: "accountDescription" },
        { key: "account_line_comments", parentMatches: ["accounts"], rename: "comments" },
        { key: "account_line_status_code", parentMatches: ["direct_shared"], rename: "account_status_code" },
        { key: "account_line_status_code", parentMatches: ["accounts"], rename: "lineStatus" },
        { key: "account", parentMatches: ["direct_shared", "indirect_support"], rename: "account_number" },
        { key: "total_cost", parentMatches: ["indirect_support"], rename: "total_value" },

        // 
        { key: "account_line_comments", parentMatches: ["direct_shared"], rename: "account_line_comments" }
      ];

      // Recursive rename function
      const deepRename = function (obj, parentKey = null, ancestors = []) {
        const getRename = (key, parentKey, ancestors) => {
          for (const r of renameRules) {
            if (r.key === key) {
              if (r.parentMatches) {
                // Check if any ancestor matches the parentMatches condition
                if (ancestors && ancestors.some(a => r.parentMatches.includes(a))) return r.rename;
                if (parentKey && r.parentMatches.includes(parentKey)) return r.rename;
              } else {
                return r.rename;
              }
            }
          }
          return key; // return the original key if no match
        };

        if (Array.isArray(obj)) {
          return obj.map(item => deepRename(item, parentKey, ancestors)); // Recursively handle arrays
        }

        if (obj && typeof obj === "object") {
          const out = {};
          const newAncestors = parentKey ? [parentKey, ...ancestors] : ancestors;
          for (const [k, v] of Object.entries(obj)) {
            const newKey = getRename(k, parentKey, ancestors); // Get the renamed key
            out[newKey] = deepRename(v, k, newAncestors); // Recursively process nested objects
          }
          return out;
        }

        return obj; // Return primitive values as they are
      };

      // Process the input based on whether it's an array or object
      let finalArray;
      if (Array.isArray(input)) {
        finalArray = deepRename(input); // Process as array
      } else if (input && typeof input === "object" && Array.isArray(input.items)) {
        finalArray = deepRename(input.items, "items"); // Handle special case for items
      } else {
        finalArray = [deepRename(input)]; // Process as a single object
      }
      // console.log("finalarray" + JSON.stringify(finalArray));
      return finalArray;  // Return the final array
    }

    // opa submit payload sample

    opaSubmitPayload(fpn_code, instanceId) {
      const payload = {
        message: [{
          fpn_code: fpn_code
        }],
        instanceId: instanceId,
        appName: "PartnerFinancialManagmentApplication",
        processName: "NegotiateFinancialPlanProcess",
        operation: "receivePartnerUpdate"
      };

      return payload;
    }

    // user preference overview table

    // overviewtableColumns(operation, budget_year, partner, work_plans, valueUSD, outputE0, in_progress, agreed, approved,negotiated_budget) {
    //   const translationMap = {
    //     "operation_name": operation,
    //     "budget_year": budget_year,
    //     "partner_name": partner,
    //     "total_workplans": work_plans,
    //     "value_usd": valueUSD,
    //     "output_eo": outputE0,
    //     "total_inprogress": in_progress,
    //     "total_agreed": agreed,
    //     "total_approved": approved,
    //     "total_negotiated_budget":negotiated_budget
    //   };
    //   const columns = JSON.parse(localStorage.getItem("t1table1"));
    //   // console.log(columns);

    //   if (columns) {
    //     columns.forEach(column => {
    //       if (translationMap[column.field]) {
    //         column.headerText = translationMap[column.field];
    //       }
    //     });
    //     return columns;
    //   } else {
    //     return [{ "headerText": operation, "field": "operation_name", "sortable": "disabled", "resizable": "enabled", "weight": 2.5 }, { "headerText": budget_year, "field": "budget_year", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 0.5 }, { "headerText": partner, "field": "partner_name", "sortable": "disabled", "resizable": "enabled", "weight": 2.5 }, { "headerText": work_plans, "field": "total_workplans", "sortable": "disabled", "resizable": "enabled", "style": "text-align: right;", "weight": 0.5 }, { "headerText": valueUSD, "field": "value_usd", "sortable": "disabled", "style": "text-align: right;", "template": "seperator", "resizable": "enabled", "weight": 1 },{ "headerText": negotiated_budget, "field": "total_negotiated_budget", "sortable": "disabled", "style": "text-align: right;", "template": "seperator", "resizable": "enabled", "weight": 1 },{ "headerText": outputE0, "field": "output_eo", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 1 }, { "headerText": in_progress, "field": "total_inprogress", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 0.5 }, { "headerText": agreed, "field": "total_agreed", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 0.5 }, { "headerText": approved, "field": "total_approved", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 1 }];
    //   }
    // }


    overviewtableColumns(
      operation,
      budget_year,
      partner,
      work_plans,
      valueUSD,
      outputE0,
      in_progress,
      agreed,
      approved,
      negotiated_budget
    ) {

      const translationMap = {
        "operation_name": operation,
        "budget_year": budget_year,
        "partner_name": partner,
        "total_workplans": work_plans,
        "value_usd": valueUSD,
        "output_eo": outputE0,
        "total_inprogress": in_progress,
        "total_agreed": agreed,
        "total_approved": approved,
        "total_negotiated_budget": negotiated_budget
      };


      const defaultColumns = [
        { "headerText": operation, "field": "operation_name", "sortable": "disabled", "resizable": "enabled", "weight": 2.5 },
        { "headerText": budget_year, "field": "budget_year", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 0.5 },
        { "headerText": partner, "field": "partner_name", "sortable": "disabled", "resizable": "enabled", "weight": 2.5 },
        { "headerText": work_plans, "field": "total_workplans", "sortable": "disabled", "resizable": "enabled", "style": "text-align: right;", "weight": 0.5 },
        { "headerText": valueUSD, "field": "value_usd", "sortable": "disabled", "style": "text-align: right;", "template": "seperator", "resizable": "enabled", "weight": 1 },
        { "headerText": negotiated_budget, "field": "total_negotiated_budget", "sortable": "disabled", "style": "text-align: right;", "template": "seperator", "resizable": "enabled", "weight": 1 },
        { "headerText": outputE0, "field": "output_eo", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 1 },
        { "headerText": in_progress, "field": "total_inprogress", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 0.5 },
        { "headerText": agreed, "field": "total_agreed", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 0.5 },
        { "headerText": approved, "field": "total_approved", "sortable": "disabled", "style": "text-align: right;", "resizable": "enabled", "weight": 1 }
      ];

      const storedColumns = JSON.parse(localStorage.getItem("t1table1")) || [];


      if (!storedColumns.length) {
        return defaultColumns;
      }


      const activeFields = defaultColumns.map(col => col.field);
      let finalColumns = storedColumns.filter(col =>
        activeFields.includes(col.field)
      );


      defaultColumns.forEach(defaultCol => {
        const exists = finalColumns.some(col => col.field === defaultCol.field);
        if (!exists) {
          finalColumns.push(defaultCol);
        }
      });


      finalColumns.forEach(column => {
        if (translationMap.hasOwnProperty(column.field)) {
          column.headerText = translationMap[column.field];
        }
      });

      return finalColumns;
    }


    // fpn search user preference table code latest

    // fpnActiontableColumns(action, partner_name, fpn_code, total_budget, last_updated_by, last_updated_date, fpn_status, fpn_id, po_number, contract_number, accumulated_expenses, columns) {
    //   console.log("columns....."+JSON.stringify(columns));
    //   const translationMap = {
    //     "action2": action,
    //     "partner_name": partner_name,
    //     "fpn_code": fpn_code,
    //     "total_budget": total_budget,
    //     "last_updated_by": last_updated_by,
    //     "last_updated_date": last_updated_date,
    //     "fpn_status": fpn_status,
    //     "fpn_id": fpn_id,
    //     "po_number": po_number,
    //     "contract_number": contract_number,
    //     "accumulated_expenses": accumulated_expenses
    //   };

    //   let columnData = JSON.parse(localStorage.getItem("fpstable"));
    //   if (!columnData) {
    //     columnData = columns || [];
    //   }

    //   if (columnData && Array.isArray(columnData) && columnData.length > 0) {
    //     columnData.forEach(column => {
    //       if (translationMap[column.field]) {
    //         column.headerText = translationMap[column.field];
    //       }
    //     });
    //     console.log("columnData...."+JSON.stringify(columnData));
    //     return columnData;
    //   }

    //   return [];
    // }

    fpnActiontableColumns(
      action,
      partner_name,
      fpn_code,
      total_budget,
      negotiated_budget,
      last_updated_by,
      last_updated_date,
      fpn_status,
      fpn_id,
      po_number,
      contract_number,
      accumulated_expenses,
      columns
    ) {

      const translationMap = {
        action2: action,
        partner_name: partner_name,
        fpn_code: fpn_code,
        total_budget: total_budget,
        total_negotiated_budget: negotiated_budget,
        last_updated_by: last_updated_by,
        last_updated_date: last_updated_date,
        fpn_status: fpn_status,
        fpn_id: fpn_id,
        po_number: po_number,
        contract_number: contract_number,
        accumulated_expenses: accumulated_expenses
      };

      const defaultColumns = Array.isArray(columns) ? columns : [];
      const storedColumns = JSON.parse(localStorage.getItem("fps4table")) || [];

      // STEP 1: build final columns from backend order
      let finalColumns = defaultColumns.map(def => {
        const stored = storedColumns.find(s => s.field === def.field);
        return stored ? { ...def, ...stored } : def;
      });

      // STEP 2: add any missing new backend columns
      // storedColumns.forEach(stored => {
      //   if (!finalColumns.some(c => c.field === stored.field)) {
      //     finalColumns.push(stored);
      //   }
      // });

      // STEP 3: ensure negotiated column exists (no manual positioning)
      const negotiatedIndex = finalColumns.findIndex(c => c.field === "total_negotiated_budget");
      const budgetIndex = finalColumns.findIndex(c => c.field === "total_budget");

      if (negotiatedIndex !== -1 && budgetIndex !== -1 && negotiatedIndex !== budgetIndex + 1) {
        const [negotiatedColumn] = finalColumns.splice(negotiatedIndex, 1);
        finalColumns.splice(budgetIndex + 1, 0, negotiatedColumn);
      }

      // STEP 4: apply translations + settings
      finalColumns.forEach(column => {

        if (translationMap[column.field]) {
          column.headerText = translationMap[column.field];
        }

        column.resizable = "enabled";

        if (!column.sortable) {
          column.sortable = "enabled";
        }

        if (["last_updated_date"].includes(column.field)) {
          column.template = "date";
        }
      });

      // STEP 5: persist merged config
      localStorage.setItem("fps4table", JSON.stringify(finalColumns));

      console.log("final columns", finalColumns);

      return finalColumns;
    }




    // Direct Programmee table user preference

    dptableColumn(columns) {
      return JSON.parse(localStorage.getItem("dptable")) || columns;
    }


    // Direct Shared table user preference

    dstableColumn(columns) {
      return JSON.parse(localStorage.getItem("do1table")) || columns;
    }

    // indirect Support table user preference

    idstableColumn(columns) {
      return JSON.parse(localStorage.getItem("idistable")) || columns;
    }

    // security context and roles

    getRoleAndBUCodes(user) {
      if (!user.UserProfile || user.UserProfile.length === 0) return { roles: '', buCodes: '' };
      const profile = user.UserProfile[0];
      let roles = '';
      if (profile.Roles && profile.Roles.length > 0) {
        roles = profile.Roles.map(r => r.RoleName).join(',');
      }
      let buCodes = '';
      if (profile.Roles && profile.Roles.length > 0) {
        const allBUCodes = profile.Roles.flatMap(r => r.SecurityContext || []).map(bu => bu.BUCode);
        buCodes = [...new Set(allBUCodes)].join(',');
      }
      return { roles, buCodes };
    }

    // to get operations

    // getMatchedBUOperations(userData) {
    //   const user = userData.UserProfile?.[0];
    //   if (!user) return [];

    //   const roles = Array.isArray(user.Roles) ? user.Roles : [];
    //   // Collect BU codes from all roles
    //   const buCodes = roles.flatMap(role =>
    //     (role.SecurityContext || []).map(sc => sc.BUCode)
    //   );

    //   // Normalize BU codes (remove "BU " prefix and lowercase for match)
    //   const normalizedBUCodes = buCodes.map(code =>
    //     code?.replace(/^BU\s+/i, '').toLowerCase()
    //   );
    //   // Match with Operations
    //   const matched = (user.Operations || []).filter(op =>
    //     normalizedBUCodes.some(bu =>
    //       op.OperationName.toLowerCase().includes(bu)
    //     )
    //   ).map(op => {
    //     const matchedBU = buCodes.find(
    //       bu => op.OperationName.toLowerCase().includes(
    //         bu?.replace(/^BU\s+/i, '').toLowerCase()
    //       )
    //     );
    //     return {
    //       operation_name: op.OperationName,
    //       operation_code: op.OperationCode
    //     };
    //   });

    //   return matched;
    // }

    getMatchedBUOperations(userData) {
      const user = userData.UserProfile?.[0];
      if (!user) return [];

      // Collect BU codes from roles' security context
      const roles = Array.isArray(user.Roles) ? user.Roles : [];
      const buCodes = roles.flatMap(role =>
        (role.SecurityContext || []).map(sc => sc.BUCode || sc.buCode)
      );

      // Collect BU codes from global security context (if it exists)
      const globalSecurityContext = Array.isArray(user.SecurityContext) ? user.SecurityContext : [];
      const additionalBUCodes = globalSecurityContext.flatMap(sc => sc.BUCode || sc.buCode);

      // Combine all BU codes and ensure uniqueness
      const allBUCodes = [...new Set([...buCodes, ...additionalBUCodes])];

      // If no BU codes are found, default to 'AFG'
      const normalizedBUCodes = allBUCodes.length > 0
        ? allBUCodes.map(code => code?.replace(/^BU\s+/i, '').toLowerCase())
        : ['afg']; // Default to 'afg' if no BUCode is found

      // Match operations based on the BU codes
      const matched = (user.Operations || []).filter(op =>
        normalizedBUCodes.some(buCode =>
          op.OperationName.toLowerCase().includes(buCode)
        )
      ).map(op => {
        const matchedBU = buCodes.find(
          bu => op.OperationName.toLowerCase().includes(
            bu?.replace(/^BU\s+/i, '').toLowerCase()
          )
        );
        return {
          operation_name: op.OperationName,
          operation_code: op.OperationCode
        };
      });

      return matched;
    }




    // Payload for login and checkout fpn

    createPayloadFromIndividualNames(userId, firstName, lastName, role) {
      const userObject = {
        user_id: userId,
        user_first_name: firstName,
        user_last_name: lastName,
        user_role: role
      };
      return {
        items: [userObject]
      };
    }

    // get operationcodes

    getOperationCodes(operations) {
      return operations.map(op => op.OperationCode).join(',');
    }

    // convert array to item

    convertFpnArrayToItems(jsonData) {
      // If fpn is already an array, take the first element
      let fpnObject = Array.isArray(jsonData.fpn) ? jsonData.fpn[0] : jsonData.fpn;

      // Wrap it inside items array
      return {
        items: [
          {
            fpn: fpnObject
          }
        ]
      };
    }


    // Dp comment history ids

    separateDpCommentIds(fullId, current) {
      console.log("fullId" + fullId);
      console.log("current" + JSON.stringify(current));

      if (typeof fullId !== 'string' || !fullId.includes('-')) {
        return null;
      }

      const parts = fullId.split('-');

      if (parts.length !== 4) {
        return null;
      }

      return {
        outputid: parts[1],
        locationid: parts[2],
        account: parts[3],
      };
    }

    buildFpnOpaPayload(payload, directSharedInput = [], indirectSupportInput = [], shared_cost, fpn_comments, riskcreating, lastUpdatedBy, createdBy, fpnDsId, fpnIscId, riskRatingTypeId, status, validationRequired, indirectPartnerType, indirectPartnerPercentage, userCurrentRole) {
      // console.log("finalpayload" + JSON.stringify(payload));
      if (!Array.isArray(payload) || payload.length === 0) {
        return { fpn: [] };
      }

      // Use first object since your input is an array with one root object
      const fpnData = payload[0].fpn;

      let seqId = 1585; // starting ID for fpn_account_id (adjust as needed)

      // Map outputs and locations (unchanged)
      const outputs = fpnData.outputs.map(output => ({
        // fpn_id: fpnData.fpn_id,
        // fpn_output_id: output.fpn_output_id,
        fpn_output_code: output.outputCode,
        output_description: output.outputDescription,
        output_total_budget: output.baseLine,
        output_total_cost: output.totalCost || 0,
        last_baseline: output.last_baseline,
        total_expenses: output.total_expenses,
        fpn_output_comments: output.comments,
        output_status_code: output.lineStatus,
        output_direct_programme_cost: output.value,
        output_direct_shared_cost: output.ds,
        output_indirect_support_cost: output.psc,
        last_updated_by: lastUpdatedBy,
        locations: output.locations.map(location => ({
          // fpn_id: fpnData.fpn_id,
          // fpn_location_id: location.fpn_location_id,
          fpn_location_code: location.locationCode,
          // fpn_output_id: location.fpn_output_id,
          output_location_total_cost: location.totalCost || 0,
          fpn_output_code: location.outputCode,
          last_baseline: location.last_baseline,
          total_expenses: location.total_expenses,
          location_description: location.location_description,
          output_location_original_budget: location.baseLine,
          output_location_direct_programme_cost: location.value,
          output_location_direct_shared_cost: location.ds,
          output_location_indirect_support_cost: location.psc,
          location_status_code: location.lineStatus,
          fpn_location_comments: location.comments,
          last_updated_by: lastUpdatedBy,
          accounts: (location.accounts || []).map(acc => ({
            // fpn_id: fpnData.fpn_id,
            // fpn_location_id: acc.fpn_location_id,
            fpn_location_code: acc.loc,
            // fpn_output_id: acc.fpn_output_id,
            fpn_outputCode: acc.outputCode,
            // fpn_account_id: seqId++, // auto-increment ID
            // account_id: acc.id,
            account_line_amount: acc.value,
            account: acc.accountCode,
            last_baseline: acc.last_baseline,
            total_expenses: acc.total_expenses,
            account_category: acc.account_category,
            account_description: acc.accountDescription,
            account_line_comments: acc.comments,
            account_line_status_code: acc.lineStatus,
            created_by: createdBy,
            last_updated_by: lastUpdatedBy
          }))
        }))
      }));

      // Build final object
      return {
        fpn:
        {
          // fpn_id: fpnData.fpn_id,
          fpn_code: fpnData.fpn_code,
          cost_center: fpnData.cost_center,
          cost_center_name: fpnData.cost_center_name,
          fpn_major_version: fpnData.fpn_major_version,
          fpn_minor_version: fpnData.fpn_minor_version,
          budget_flexibility: riskRatingTypeId || '',
          validation_state: fpnData.validation_state,
          active_flag: fpnData.active_flag,
          operation_name: fpnData.operation_name,
          operation_code: fpnData.operation_code,
          fpn_status_code: fpnData.fpn_status,
          total_original_budget: fpnData.total_original_budget,
          contract_currency_code: fpnData.contract_currency_code,
          partner_name: fpnData.partner_name,
          partner_number: fpnData.partner_number,
          partner_site_code: fpnData.partner_site_code,
          total_negotiated_budget: fpnData.total_negotiated_budget,
          total_direct_programme_cost: fpnData.total_direct_programme_cost,
          total_direct_shared_cost: fpnData.total_direct_shared_cost,
          total_indirect_support_cost: fpnData.total_indirect_support_cost,
          total_expenses: fpnData.total_expenses,
          contract_number: fpnData.contract_number,
          po_number: fpnData.po_number || '',
          fpn_comments: fpn_comments,
          budget_year: fpnData.budget_year,
          last_updated_by: lastUpdatedBy,
          total_prepayment: fpnData.total_prepayment,
          recalculation_required: status,
          validation_state: validationRequired || "",
          reallocation_required: fpnData.reallocation_required || "",
          business_unit: fpnData.business_unit || "",
          in_capacity_of: userCurrentRole || "TESTER",
          award_project_number: fpnData.award_project_number || "",
          essential_controls: riskcreating || "",
          draft_submission_status: status || "",
          created_by: createdBy || "",

          // ✅ Only updated part
          direct_shared: (directSharedInput.length > 0 ? directSharedInput : (fpnData.direct_shared || []))
            .map(ds => ({
              // fpn_id: fpnData.fpn_id,
              // fpn_ds_id: fpnDsId,
              // account_id: ds.account_id,
              account_line_amount: ds.account_line_amount,
              negotiated_amount: ds.account_negotiated_amount,
              account_line_status_code: ds.account_status_code,
              account: ds.account_number,
              account_description: ds.account_description,
              account_line_comments: ds.account_line_comments,
              created_by: createdBy,
              last_updated_by: lastUpdatedBy
            })),

          indirect_support: (indirectSupportInput.length > 0 ? indirectSupportInput : (fpnData.indirect_support || []))
            .map(is => ({
              // fpn_isc_id: fpnIscId,
              // account_id: is.account_id,
              total_cost: is.total_value,
              shared_cost: is.shared_cost,
              account: is.account_number,
              account_description: is.account_description,
              partner_type: indirectPartnerType || "",
              partner_percentage: indirectPartnerPercentage,
              created_by: createdBy || "",
              last_updated_by: lastUpdatedBy || ""
            })),

          outputs
        }
      };
    }

    addUserOpaPayload(firstName, lastName, displayName, email, groupName) {
      const userObject = {
        "first_name": firstName,
        "last_name": lastName,
        "display_name": displayName,
        "group_name": groupName,
        "email": email,
        // The 'operation' is static for this use case
        "operation": "add"
      };

      const payload = {
        "Users": [userObject]
      };

      return payload;
    }

    // addUserOpaPayload(firstName, lastName, displayName, email, groupName) {
    //   const userObject = {
    //     "first_name": "Nandhini",
    //     "last_name": "Loganathan",
    //     "display_name": "Nandhini Loganathan",
    //     "group_name": groupName,
    //     "email": "ct-loganatn@unhcr.org",
    //     // The 'operation' is static for this use case
    //     "operation": "add"
    //   };

    //   const payload = {
    //     "Users": [userObject]
    //   };

    //   return payload;
    // }

    // opaAccessTokenPayload(email) {
    //   const payload = {
    //     "integrationName": "Vbcs_Access_Token",
    //     "invokedBy": "LOGANATN@unhcr.org",
    //     "scope": "OpaScope"
    //   };

    //   return payload;
    // }

    // addUserOpaPayload(firstName, lastName, displayName, email, groupName) {
    //   const userObject = {
    //     "first_name": "Nandhini",
    //     "last_name": "Loganathan",
    //     "display_name": displayName,
    //     "group_name": groupName,
    //     "email": "LOGANATN@unhcr.org",
    //     // The 'operation' is static for this use case
    //     "operation": "add"
    //   };

    //   const payload = {
    //     "Users": [userObject]
    //   };

    //   return payload;
    // }

    // opa access token payload

    opaAccessTokenPayload(email) {
      const payload = {
        "integrationName": "Vbcs_Access_Token",
        "invokedBy": email,
        "scope": "OpaScope"
      };

      return payload;
    }

    // opaAccessTokenPayload(email) {
    //   const payload = {
    //     "integrationName": "Vbcs_Access_Token",
    //     "invokedBy": "ct-loganatn@unhcr.org",
    //     "scope": "OpaScope"
    //   };

    //   return payload;
    // }

    // format token for opa

    formatAsBearerToken(token) {
      if (!token) {
        return "";
      }
      return `Bearer ${token}`;
    }

    setToArray(inputSet) {
      // 1. Check for null or undefined
      if (inputSet === null || typeof inputSet === 'undefined') {
        console.error("Input is null or undefined. Returning an empty array.");
        return []; // Return an empty array or throw an error, depending on desired behavior.
      }

      // 2. Check if the input is an iterable object
      // A common way to check for iterability is looking for the Symbol.iterator method.
      // Note: Strings (like '') are iterable and will pass this check.
      if (typeof inputSet[Symbol.iterator] !== 'function') {
        // If it's not a function (i.e., not iterable), log a warning and return an empty array.
        console.warn(`Input of type '${typeof inputSet}' is not iterable. Returning an empty array.`);
        return [];
      }

      // If the input passes the checks (or is a valid iterable like a Set or a String),
      // then Array.from() can safely be called.
      return Array.from(inputSet);
    }

    arrayToSet(inputArray) {
      // Check if the input is valid before creating the Set
      if (Array.isArray(inputArray)) {
        return new Set(inputArray);
      }
      // Return a new empty Set if the persisted value was null/undefined
      return new Set();
    }

    formatBUCode(value) {
      if (!value) return [];
      // Split by comma and trim the whitespace from each element
      return value.split(',').map(v => v.trim());
    }





  }

  return PageModule;
});


