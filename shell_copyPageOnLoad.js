define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class shellPageOnLoad extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $application } = context;

      // === SESSION INACTIVITY / IDLE LOGIC ===
      // const IDLE_TIMEOUT = 2 * 60 * 1000; // 15 minutes
      // const WARNING_TIME = 30 * 1000;  // 2 minutes before timeout

            const IDLE_TIMEOUT = 30 * 60 * 1000; // 15 minutes
      const WARNING_TIME = 2* 60 * 1000;  // 2 minutes before timeout

      let idleTimer;
      let warningTimer;

      const resetIdleTimer = async () => {
        clearTimeout(idleTimer);
        clearTimeout(warningTimer);

        // Show warning 2 minutes before timeout
        warningTimer = setTimeout(async () => {
         await Actions.callComponentMethod(context, {
            selector: '#sessionWarning',  // Your popup component ID
            method: 'open',
          });
        }, IDLE_TIMEOUT - WARNING_TIME);

        // Final action when session expires
        idleTimer = setTimeout(async () => {

          // Open the session expired popup
          await Actions.callComponentMethod(context, {
            selector: '#sessionExpired',  // Your popup component ID
            method: 'open',
          });

         

        }, IDLE_TIMEOUT);
      };

      // Listen to all user activity to reset the timer
      ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event =>
        window.addEventListener(event, resetIdleTimer)
      );

      // Initialize timers
      resetIdleTimer();
    }

  }

  return shellPageOnLoad;
});