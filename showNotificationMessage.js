/* Copyright (c) 2024, Oracle and/or its affiliates */

define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
) => {
  'use strict';

  class showNotificationMessage extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{summary:string,message:string,displayMode:string,type:string,key:string,target:string}} params.event
     */
    async run(context, { event }) {
      const { $page, $variables } = context;

      // let msg = {
      //   messageType: event.type === "confirmation" ? "general-success" : "general-"+event.type,
      //   primaryText: event.summary,
      //   secondaryText: event.message,
      //   id: $page.variables.messageId
      // };
      // $page.variables.messageId++;

      // await Actions.fireDataProviderEvent(context, {
      //   target: $page.variables.messagesBannerADP,
      //   add: {
      //     data: msg,
      //   },
      // });

      // if (event.displayMode === "transient") {
      //   setTimeout(() => {
      //     Actions.fireDataProviderEvent(context, {
      //       target: $page.variables.messagesBannerADP,
      //       remove: {
      //         keys: [msg.id],
      //       },
      //     });
      //   }, 5000);
      // }

      event.autoTimeout = 5000; // Set autoTimeout to 1 millisecond if not already defined

      await Actions.resetVariables(context, {
        variables: [
    '$variables.messagesADP',
  ],
      });
      
      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.messagesADP,
        add: {
          data: [event],
        },
      });


    }
  }

  return showNotificationMessage;
});
