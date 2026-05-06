define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (ActionChain, Actions, ActionUtils) => {
  'use strict';

  class PrintActionChain extends ActionChain {
    async run(context, { fpnCode, status, mode }) {
      const { $application, $functions } = context;
      const storage = $application.variables.objectStorageDetails;

      const openPB = () =>
        Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'open',
        });

      const closePB = () =>
        Actions.callComponentMethod(context, {
          selector: '#progressbar',
          method: 'close',
        });

      const notify = (msg, type = 'error') =>
        Actions.fireNotificationEvent(context, {
          summary: msg,
          type,
        });

      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 15);

      const filename = `${fpnCode}${timestamp}.json`;
      const objectName = `${fpnCode}.pdf`;

      try {
        await openPB();
        const res = await Actions.callRest(context, {
          endpoint: 'pfmGateway/getModifyfpn',
          uriParams: { p_fpn_code: fpnCode },
        });

        if (!res.body.count) {
          await notify('No records found for the selected FPN', 'info');
          return;
        }

        // 🔹 2. Transform
        const mapped = await $functions.mapToTemplate(res.body.items);

        await Actions.callRest(context, {
          endpoint: 'objectStorage/putObjects',
          uriParams: {
            object: filename,
            bucket: storage.bucket,
            namespace: storage.namespace,
            prefix: storage.prefix,
            subfolder: mode === 'SUBMIT'
                ? storage.json_files_folder_name
                        : storage.json_files_folder_name,
          },
          contentType: 'application/json',
          body: mapped,
        });

        const payload = await $functions.docGeneratorFPNPayload(
          filename,
          fpnCode,
          storage.bucket,
          storage.namespace,
          storage.prefix,
          storage.json_files_folder_name,
          storage.template_folder_name,
          mode === 'SUBMIT'
            ? storage.fpnAconexUploadFolderName
            : storage.fpn_documents_folder_name
        );

        const docRes = await Actions.callRest(context, {
          endpoint: 'documenntGeneratorFunction/postInvoke',
          body: payload,
        });

        if (docRes.body.code !== 200) {
          let msg =
            mode === 'SUBMIT'
              ? 'Error generating report for submission.'
              : 'Error generating report.';

          if (docRes.body?.error) {
            msg += ` Details: ${docRes.body.error}`;
          }

          await notify(msg);
          return;
        }

        if (mode === 'PRINT') {
          const fileRes = await Actions.callRest(context, {
            endpoint: 'objectStorage/getObjects',
            uriParams: {
              object: objectName,
              bucket: storage.bucket,
              namespace: storage.namespace,
              prefix: storage.prefix,
              subfolder: storage.fpn_documents_folder_name,
            },
            responseBodyFormat: 'blob',
          });

          await $functions.downloadFile(
            fileRes.body,
            fileRes.headers.get('content-type'),
            objectName
          );
        }

      } catch (err) {
        if (err.status === 504) {
          await notify('Timeout: Report generation is taking too long.');
        } else {
          await notify('Unexpected error. Please contact support.');
        }
      } finally {
        await closePB();
      }
    }
  }

  return PrintActionChain;
});