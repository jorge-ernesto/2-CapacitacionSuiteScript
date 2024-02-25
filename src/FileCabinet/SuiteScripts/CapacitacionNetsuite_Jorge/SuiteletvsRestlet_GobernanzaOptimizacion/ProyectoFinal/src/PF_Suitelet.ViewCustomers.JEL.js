/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['../lib/PF_Customer.Manager', 'N'],

    (CustomerManager, N) => {

        const { runtime, log } = N;


        function onRequest(context) {

            log.debug('Init Memory', runtime.getCurrentScript().getRemainingUsage());
            let start = new Date();
            log.debug('Data', CustomerManager.list());
            let end = new Date();

            log.debug('Memory After List v1', runtime.getCurrentScript().getRemainingUsage());
            log.debug('Time', (end.getTime() - start.getTime()) / 1000);

            log.debug('-', '---------------------------------------');

            start = new Date();
            log.debug('Data', CustomerManager.list_v2());
             end = new Date();
            log.debug('Memory After List v2', runtime.getCurrentScript().getRemainingUsage());
            log.debug('Time', (end.getTime() - start.getTime()) / 1000);

        }

        return { onRequest }


    });


