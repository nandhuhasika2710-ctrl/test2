/* Copyright (c) 2024, Oracle and/or its affiliates */

define(['oj-sp/spectra-shell/config/config'], function () {
  'use strict';

  class AppModule {



    handleOAuthFlow() {
      console.log('Current URL after redirect:', window.location.href); // Log the current URL for debugging

      // Get the authorization code from the URL
      const authCode = this.getQueryParameter('code');
      console.log("Authorization code:", authCode);

      if (authCode) {
        // If the authorization code is present in the URL, call the exchange function
        this.exchangeAuthCodeForToken(authCode);
      } else {
        console.error("Authorization code not found in URL");
      }
    }

    // getMatchedBUOperations(userData) {
    //   const user = userData.UserProfile?.[0];
    //   if (!user) return [];

    //   // Collect BU codes from roles' security context
    //   const roles = Array.isArray(user.Roles) ? user.Roles : [];
    //   const buCodes = roles.flatMap(role =>
    //     (role.SecurityContext || []).map(sc => sc.BUCode || sc.buCode)
    //   );

    //   // Collect BU codes from global security context (if it exists)
    //   const globalSecurityContext = Array.isArray(user.SecurityContext) ? user.SecurityContext : [];
    //   const additionalBUCodes = globalSecurityContext.flatMap(sc => sc.BUCode || sc.buCode);

    //   // Combine all BU codes and ensure uniqueness
    //   const allBUCodes = [...new Set([...buCodes, ...additionalBUCodes])];

    //   // If no BU codes are found, directly use operations without filtering
    //   if (allBUCodes.length === 0) {
    //     // No BU codes found, return all operations directly
    //     return (user.Operations || []).map(op => ({
    //       operation_name: op.OperationName,
    //       operation_code: op.OperationCode
    //     }));
    //   }

    //   // Normalize BU codes (remove 'BU' prefix and convert to lowercase)
    //   const normalizedBUCodes = allBUCodes.length > 0
    //     ? allBUCodes.map(code => code?.replace(/^BU\s+/i, '').toLowerCase())
    //     : ['afg']; // Default to 'afg' if no BUCode is found

    //   // Match operations based on the BU codes
    //   const matched = (user.Operations || []).filter(op =>
    //     normalizedBUCodes.some(buCode =>
    //       op.OperationName.toLowerCase().includes(buCode)
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

    // getMatchedBUOperations(userData) {
    //   const user = userData.UserProfile?.[0];
    //   if (!user) return []; // Return empty array if no user profile found

    //   // Collect BU codes from roles' security context (if any)
    //   const roles = Array.isArray(user.Roles) ? user.Roles : [];
    //   const buCodesFromRoles = roles.flatMap(role =>
    //     (role.SecurityContext || []).map(sc => sc.BUCode || sc.buCode)
    //   );

    //   // Collect BU codes from the global security context (if any)
    //   const globalSecurityContext = Array.isArray(user.SecurityContext) ? user.SecurityContext : [];
    //   const additionalBUCodes = globalSecurityContext.flatMap(sc => sc.BUCode || sc.buCode);

    //   // Combine all BU codes and ensure uniqueness
    //   const allBUCodes = [...new Set([...buCodesFromRoles, ...additionalBUCodes])];

    //   // If no BU codes are found
    //   if (allBUCodes.length === 0) {
    //     // Check if UserID ends with 'unhcr.org' and return nothing (empty array)
    //     if (user.UserID.endsWith('unhcr.org')) {
    //       return [];
    //     }

    //     // Otherwise, return all operations without filtering
    //     return (user.Operations || []).map(op => ({
    //       operation_name: op.OperationName,
    //       operation_code: op.OperationCode
    //     }));
    //   }

    //   // Normalize BU codes (remove 'BU' prefix and convert to lowercase)
    //   const normalizedBUCodes = allBUCodes.map(code => code?.replace(/^BU\s+/i, '').toLowerCase());

    //   // Match operations based on the normalized BU codes
    //   const matchedOperations = (user.Operations || []).filter(op =>
    //     normalizedBUCodes.some(buCode =>
    //       op.OperationName.toLowerCase().includes(buCode)
    //     )
    //   ).map(op => ({
    //     operation_name: op.OperationName,
    //     operation_code: op.OperationCode
    //   }));

    //   return matchedOperations;
    // }


    //     getRoleAndBUCodes(user) {
    //       if (!user.UserProfile || user.UserProfile.length === 0) return { roles: '', buCodes: '' };
    //       const profile = user.UserProfile[0];
    //       let roles = '';
    //       let rolesDisplay='';
    //       if (profile.Roles && profile.Roles.length > 0) {
    //         roles = profile.Roles.map(r => r.RoleName).join(',');
    //         rolesDisplay = profile.Roles.map(r => r.RoleName.replace(/_/g, ' ')).join(', ');
    //       }

    //       let buCodes = '';
    //       if (profile.Roles && profile.Roles.length > 0) {
    //         const allBUCodes = profile.Roles.flatMap(r => r.SecurityContext || []).map(bu => bu.BUCode);
    //         buCodes = [...new Set(allBUCodes)].join(',');
    //       }
    //       return { roles,rolesDisplay,buCodes };
    //     }
    // //tyu

    getMatchedBUOperations(userData, selectedRoleName) {
      const user = userData.UserProfile?.[0];
      if (!user) return []; // No user profile found

      if (!selectedRoleName) return []; // No role passed → return empty

      // 
      const selectedRole = (user.Roles || []).find(role => role.RoleName === selectedRoleName);
      if (!selectedRole) return []; // Role not found → return empty
      if (!selectedRole.SecurityContext || selectedRole.SecurityContext.length === 0) {
        return (user.Operations || []).map(op => ({
          operation_name: op.OperationName,
          operation_code: op.OperationCode
        }));
      }
      // 
      const buCodesFromRole = (selectedRole.SecurityContext || []).map(sc => sc.BUCode || sc.buCode);

      // 
      if (buCodesFromRole.length === 0) return [];

      // 
      const normalizedBUCodes = buCodesFromRole.map(code => code?.replace(/^BU\s+/i, '').toLowerCase());

      // 
      const matchedOperations = (user.Operations || []).filter(op =>
        normalizedBUCodes.some(buCode =>
          op.OperationName.toLowerCase().includes(buCode)
        )
      ).map(op => ({
        operation_name: op.OperationName,
        operation_code: op.OperationCode
      }));

      return matchedOperations;
    }

    getRoleAndBUCodes(user) {
      if (!user.UserProfile || user.UserProfile.length === 0) return { roles: '', buCodes: '' };
      const profile = user.UserProfile[0];
      let roles = '';
      let rolesDisplay = '';
      let rolesArray = [];
      if (profile.Roles && profile.Roles.length > 0) {
        rolesArray = profile.Roles.map(r => ({
          value: r.RoleName,                     // stored value
          label: r.RoleName.replace(/_/g, ' ')   // displayed text
        }));
        roles = profile.Roles.map(r => r.RoleName).join(',');
        rolesDisplay = profile.Roles.map(r => r.RoleName.replace(/_/g, ' ')).join(', ');
      }

      let buCodes = '';
      if (profile.Roles && profile.Roles.length > 0) {
        const allBUCodes = profile.Roles.flatMap(r => r.SecurityContext || []).map(bu => bu.BUCode);
        buCodes = [...new Set(allBUCodes)].join(',');
      }
      return { roles, rolesDisplay, buCodes, rolesArray };
    }

    getRoleAndBUCodesByRole(user, selectedRoleName) {
      if (!user.UserProfile || user.UserProfile.length === 0)
        return { roles: '', rolesDisplay: '', buCodes: '', rolesArray: [] };

      const profile = user.UserProfile[0];

      // Build roles array for UI
      let rolesArray = [];
      if (profile.Roles && profile.Roles.length > 0) {
        rolesArray = profile.Roles.map(r => ({
          value: r.RoleName,                     // stored value
          label: r.RoleName.replace(/_/g, ' ')   // displayed text
        }));
      }
      // If selectedRoleName is null or empty, display all roles only
      if (!selectedRoleName) {
        return {
          roles: profile.Roles.map(r => r.RoleName).join(','),
          rolesDisplay: profile.Roles.map(r => r.RoleName.replace(/_/g, ' ')).join(', '),
          buCodes: '',
          rolesArray
        };
      }
      // Find the role that matches selectedRoleName
      const selectedRole = (profile.Roles || []).find(r => r.RoleName === selectedRoleName);

      // If role not found, return empty BUCodes
      if (!selectedRole) {
        return {
          roles: selectedRoleName || '',
          rolesDisplay: selectedRoleName ? selectedRoleName.replace(/_/g, ' ') : '',
          buCodes: '',
          rolesArray
        };
      }

      let buCodes = '';

     
      if (selectedRole.SecurityContext && selectedRole.SecurityContext.length > 0) {
        const buCodesArray = selectedRole.SecurityContext.map(
          sc => sc.BUCode || sc.buCode
        );
        buCodes = [...new Set(buCodesArray)].join(',');
      }

    
      else if (
        selectedRole.RoleName === 'HCR_PFM_PARTNERS' &&
        profile.Operations &&
        profile.Operations.length > 0
      ) {
        const opsNames = profile.Operations.map(op => op.OperationName);
        buCodes = [...new Set(opsNames)].join(',');
      }


      return {
        roles: selectedRole.RoleName,
        rolesDisplay: selectedRole.RoleName.replace(/_/g, ' '),
        buCodes,
        rolesArray
      };
    }
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
      return operations.map(op => op.operation_code).join(',');
    }

    getQueryParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      console.log("urlParams", urlParams);  // Log URL parameters to debug
      return urlParams.get('code');
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
    //     "display_name": displayName,
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
    formatAsBearerToken(token) {
      if (!token) {
        return "";
      }
      return `Bearer ${token}`;
    }

  }


  AppModule.prototype.getCode = function (clientId, redirectUrl) {
    const authorizationUrl = "https://constructionandengineering.oraclecloud.com/auth/authorize?response_type=code&client_id=" + clientId + "&redirect_uri=" + redirectUrl;
    window.location.href = authorizationUrl;  // Redirect user to Aconex for OAuth2 authentication

    console.log("Redirecting to Aconex OAuth2:", authorizationUrl);  // Log the URL for debugging
  };

  //  AppModule.prototype.getCode = function () {
  //   const authorizationUrl = "https://constructionandengineering.oraclecloud.com/auth/authorize?response_type=code&client_id=SCP_PFM_Auth_Client_SIT_INTERNAL_ACONEX_client_APPID&redirect_uri=https://apps-portal-nonprod.unhcr.org/test/promsapp";
  //   window.location.href = authorizationUrl;  // Redirect user to Aconex for OAuth2 authentication

  //   console.log("Redirecting to Aconex OAuth2:", authorizationUrl);  // Log the URL for debugging
  // };


  return AppModule;
});
