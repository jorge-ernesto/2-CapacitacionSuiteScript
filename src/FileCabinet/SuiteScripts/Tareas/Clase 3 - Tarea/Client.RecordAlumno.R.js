/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, currentRecord, record } = N;
        const { message } = N.ui;

        /******************/

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

            // Obtener el currentRecord
            let recordContext = scriptContext.currentRecord;

            // El campo name, debe concatenarse automaticamente con el firstname y lastname
            if (scriptContext.fieldId == 'custrecord_jel_alumno_firstname' || scriptContext.fieldId == 'custrecord_jel_alumno_lastname') {
                let firstName = recordContext.getValue({
                    fieldId: 'custrecord_jel_alumno_firstname'
                });

                let lastName = recordContext.getValue({
                    fieldId: 'custrecord_jel_alumno_lastname'
                });

                recordContext.setValue({
                    fieldId: 'name',
                    value: `${firstName} ${lastName}`,
                    ignoreFieldChange: true
                });
            }
        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {

        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

            // Obtener el currentRecord
            let recordContext = scriptContext.currentRecord;

            // Esto se ejecuta cuando se hacen cambios en el campo email
            if (scriptContext.fieldId == 'custrecord_jel_alumno_email') {
                let emailValue = recordContext.getValue('custrecord_jel_alumno_email');

                // El campo email debe tener siempre '@biomont.com'
                if (validarBiomont(emailValue)) {
                    return true;
                }

                return false;
            }

            // Retornar true para escapar de la validacion de campos
            return true;
        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

            // Obtener el currentRecord
            let recordContext = scriptContext.currentRecord;

            // Obtener el valor del campo email
            let emailValue = recordContext.getValue('custrecord_jel_alumno_email');

            // El campo email debe tener siempre '@biomont.com'
            if (!validarBiomont(emailValue)) {
                // Mostrar mensaje de validación al usuario
                var messageValidation = message.create({
                    title: "Validación",
                    message: "El email debe contener '@biomont.com'",
                    type: message.Type.ERROR
                });
                messageValidation.show({
                    duration: 5000 // Duración del mensaje en milisegundos (5 segundos en este ejemplo)
                });
                return false;
            }

            return confirm("Estas seguro que quieres guardar el record.");
        }

        /**
         * Función para validar si un string contiene 'biomont.com'
         * @param {string} str - El string que se va a validar
         * @returns {boolean} - Devuelve true si el string contiene 'biomont.com', de lo contrario, devuelve false.
         */
        function validarBiomont(str) {
            // La función 'indexOf' devuelve la posición de la primera aparición de la subcadena,
            // o -1 si no se encuentra.
            // Si el resultado es mayor o igual a 0, significa que la subcadena está presente en el string.
            return str.indexOf('biomont.com') >= 0;
        }

        return {
            // pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord
        };

    });
