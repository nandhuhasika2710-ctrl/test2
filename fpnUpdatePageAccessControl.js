define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils'
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class fpnUpdatePageAccessControl extends ActionChain {
    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.fpn_status
     */
    async run(context, { fpn_status }) {
      const { $variables, $application } = context;

      const role = $application.variables.userRole;
            const status = fpn_status.trim();     // FPN Status
      const draftStatus = $variables.fpnDraftSubmitStatus;
            $variables.canChangeScope = (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER' || role === 'PFM_SUPERUSER');
      if (role === 'VIEW_ONLY') {
        $variables.canEdit = false;
        $variables.canView = false;

        console.log('[AccessControl] Role is VIEW_ONLY — all access denied');
        return;
      }
      // Set defaults
      $variables.canEdit = false;
      $variables.canView = false;
      $variables.showPrepaymentBtn = false;
      $variables.canCreditNote = false;
      $variables.partnerCanEdit = true;

      switch (status) {
        case 'Scoped':
          if (role === 'PARTNER_USER' && $variables.reallocationRequired === 'Y') {
            $variables.canEdit = true;
            $variables.canView = true;
             $variables.partnerCanEdit = false;
          }
          else if ((role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER' ) && $variables.reallocationRequired !== 'Y') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = false;
            $variables.canEdit = false;
          }
          break;
        //     case 'Rescoped':
        //       if (loginType === 'Partner') {
        //         $variables.canView = true;
        //       } else if (role === 'PROGRAMME_OFFICER') {
        //         $variables.canEdit = true;
        //         $variables.canView = true;
        //       } else {
        //         $variables.canView = true;
        //       }
        //       break;

        case 'Proposed':
          if (role === 'PARTNER_USER' ) {
            $variables.canEdit = true;
            $variables.canView = true;
            $variables.partnerCanEdit = false;
          }
          else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER')  {
            $variables.canView = true;
            $variables.canEdit = true;
          }
          break;

        case 'Revised':
          if (role === 'PARTNER_USER') {
            $variables.canEdit = true;
            $variables.canView = true;
            $variables.partnerCanEdit = false;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = true;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          break;
        case 'Endorsed':
          if (role === 'PARTNER_USER' && draftStatus !=='SUBMIT') {
            $variables.canEdit = true;
            $variables.canView = true;
            $variables.partnerCanEdit = false;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = true;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          break;

        case 'Agreed':
          if (role === 'PARTNER_USER') {
            $variables.canEdit = false;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = true;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          break;

        case 'Approved':
          if (role === 'PARTNER_USER') {
            $variables.canEdit = false;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = false;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = false;
            $variables.canView = false;
          }
          break;
          case 'Rejected':
          // if (role === 'PARTNER_USER' ) {
          //   $variables.canEdit = false;
          //   $variables.canView = true;
          // } 
          if (role === 'PARTNER_USER' && $variables.reallocationRequired === 'Y' ) {
            $variables.canEdit = true;
            $variables.canView = true;
             $variables.partnerCanEdit = false;
          }
          else if ((role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') && $variables.reallocationRequired !== 'Y') {
            $variables.canEdit = true;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          break;


        case 'Under Review':
          if (role === 'PARTNER_USER') {
            $variables.canEdit = true;
            $variables.canView = true;
             $variables.partnerCanEdit = false;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = true;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = true;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          break;

          case 'Under Rescope':
          if (role === 'PARTNER_USER') {
            $variables.canEdit = false;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = false;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = false;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = false;
            $variables.canView = true;
          }
          break;

           case 'Rescoped':
          if (role === 'PARTNER_USER') {
            $variables.canEdit = false;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROGRAMME_OFFICER' || role === 'JUNIOR_PROGRAMME_OFFICER') {
            $variables.canEdit = true;
            $variables.canView = true;
          } else if (role === 'SENIOR_PROJECT_CONTROL' || role === 'JUNIOR_PROJECT_CONTROL') {
            $variables.canView = false;
            $variables.canEdit = false;
          }
          else if (role === 'PFM_SUPERUSER') {
            $variables.canEdit = true;
            $variables.canView = true;
          }
          break;

        //     case 'Closed':
        //       if (role === 'REPRESENTATIVE') {
        //         $variables.canEdit = true;
        //       }
        //       $variables.canView = true;
        //       break;

        //     case 'Deleted':
        //       // No edit or view expected at FPN level — usually line-item only
        //       $variables.canEdit = false;
        //       $variables.canView = false;
        //       break;

        //     default:
        //       // If status is unknown, deny all access
        //       $variables.canEdit = false;
        //       $variables.canView = false;
        //       break;
        //   }
      }
      console.log('[AccessControl] Status:', status);
      console.log('[AccessControl] Role:', role);
      //   console.log('[AccessControl] LoginType:', loginType);
      console.log('[AccessControl] canEdit:', $variables.canEdit);
      console.log('[AccessControl] canView:', $variables.canView);
      //   console.log('[AccessControl] showPrepaymentBtn:', $variables.showPrepaymentBtn);
      //   console.log('[AccessControl] canCreditNote:', $variables.canCreditNote);    
    }
  }

  return fpnUpdatePageAccessControl;
});
