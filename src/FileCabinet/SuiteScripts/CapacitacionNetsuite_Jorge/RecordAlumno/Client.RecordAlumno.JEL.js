// Notas del archivo:
// - Secuencia de comando:
//      - Biomont CS Alumnos Jorge (customscript_jel_bio_cs_alumnos)
// - Registro:
//      - Alumnos Jorge (customrecord_jel_alumnos)

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

            // Obtener el currentRecord y mode
            // let recordContext = scriptContext.currentRecord;
            // let mode = scriptContext.mode;

            // Ver en consola el currentRecord y mode
            // console.log('recordContext:', recordContext);
            // console.log('mode:', mode);

            // Obtener el currentRecord
            // let recordContext = scriptContext.currentRecord;

            // Setear un valor a un campo
            // recordContext.setValue({
            //     fieldId: 'custrecord_jel_alumno_firstname',
            //     value: 'Ernesto',
            //     ignoreFieldChange: true
            // });
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
            // let recordContext = scriptContext.currentRecord;

            // Esto se ejecuta para todos los campos
            // console.log('recordContext:', recordContext);

            // Esto se ejecuta cuando se hacen cambios en el campo firstname
            // if (scriptContext.fieldId == 'custrecord_jel_alumno_firstname') {
            //     let nombreValue = recordContext.getValue('custrecord_jel_alumno_firstname');
            //     alert("El Nombre es: " + nombreValue);
            // }
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

            // Esto se ejecuta cuando se hacen cambios en el campo firstname
            if (scriptContext.fieldId == 'custrecord_jel_alumno_firstname') {
                let firstnameValue = recordContext.getValue('custrecord_jel_alumno_firstname');

                // El campo firstname debe ser siempre Ernesto
                if (firstnameValue == 'Ernesto') {
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

            // confirm retorna true o false segun respuesta del usuario
            return confirm("Estas seguro que quieres guardar el record.");
        }

        function ejecutarBoton() {

            // Obtener el currentRecord
            // En una funcion personalizada, no viene ningun currenRecord, entonces debemos usar el modulo base
            // currentRecord.get(), recupera el mismo currentRecord que tiene cada funcion estandar
            let recordContext = currentRecord.get();

            // Verificar currentRecord
            console.log('recordContext:', recordContext);

            // Obtener type y id del currentRecord
            let { type, id } = recordContext;

            // Verificar type y id
            console.log('type:', type);
            console.log('id:', id);

            // Obtener el record del alumno mendiante el modulo N/record
            let newRecord = record.load({ type: type, id: id });

            // Verificar record
            console.log('newRecord:', newRecord)

            // Obtener valor mediante prompt
            let newValue = prompt('Ingrese Nombre');

            // Setear y guardar valor
            newRecord.setValue('custrecord_jel_alumno_firstname', newValue);
            newRecord.save();

            // Actualizar pagina
            window.location.reload();
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord,
            ejecutarBoton: ejecutarBoton
        };

    });
