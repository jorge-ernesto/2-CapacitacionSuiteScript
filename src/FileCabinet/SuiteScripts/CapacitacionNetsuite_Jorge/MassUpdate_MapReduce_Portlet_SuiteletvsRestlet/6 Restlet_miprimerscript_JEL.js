// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Mi Primer Restlet (customscript_jel_bio_rl_miprimerrestlet)

/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N'],

    (N) => {

        const { search, log, record } = N;

        /******************/

        function getComprobantesList() {

            let result = [];

            search.create({
                type: 'customtransaction_ns_comp_ret',
                columns: ['internalid', 'name', 'amount']
            }).run().each(node => {

                let id = node.getValue(node.columns[0]);
                let name = node.getValue(node.columns[1]);
                let amount = node.getValue(node.columns[2]);

                result.push({ id, name, amount });
                return true;
            });

            return result;
        }

        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        function get(requestParams) {

            let comprobantes = getComprobantesList();

            return JSON.stringify(comprobantes);
        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        function put(context) {

            let { id, email } = context;

            // Actualizar registro
            let customerRecord = record.load({ type: 'customer', id: id });
            customerRecord.setValue('custentity24', email);

            customerRecord = customerRecord.save({ ignoreMandatoryFields: true });

            return 'Customer ' + customerRecord + " Updated";
        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        function post(context) {

            let { companyName } = context;

            // Crear registro
            let customerRecord = record.create({ type: 'customer' });
            customerRecord.setValue('companyname', companyName);
            customerRecord.setValue('subsidiary', 2);
            customerRecord.setValue('email', 'ejemplo@customrest.com');

            customerRecord = customerRecord.save({ ignoreMandatoryFields: true });

            return 'Customer ' + customerRecord + " Created";
        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        function doDelete(context) {

            log.debug('delete', context)

            let { _customer } = context;

            // Eliminar registro
            record.delete({ type: 'customer', id: _customer });

            // Eliminar registro
            /*let customerRecord = record.load({ type: 'customer', id: _customer });
            customerRecord.setValue('isinactive', true);

            customerRecord = customerRecord.save({ ignoreMandatoryFields: true });*/

            return 'Customer deleted';
        }

        return { get, put, post, delete: doDelete }

    });
