/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['../lib/PF_Customer.Manager'],

    (CustomerManager) => {

        function doPost(context) {

            return CustomerManager.create(context);

        }

        function doPut(context) {
            return CustomerManager.update(context);

        }

        return {
            post: doPost,
            put: doPut
        }

    });
