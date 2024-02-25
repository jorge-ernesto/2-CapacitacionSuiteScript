/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N'],

    function (N) {

        const { log, runtime, record, search, email } = N;
        const { serverWidget } = N.ui;

        /******************/

        const ALUMNO_RECORD = {
            fields: {
                'name': 'name',
                'firstname': 'custrecord_jel_alumno_firstname',
                'lastname': 'custrecord_jel_alumno_lastname',
                'email': 'custrecord_jel_alumno_email',
                'phone': 'custrecord_jel_alumno_phone'
            }
        }

        // Quitar obligatoriedad al campo 'name' y lo deshabilitamos
        function disableNameField(form) {
            let name = form.getField('name');
            name.isMandatory = false;
            name.updateDisplayType({ displayType: 'DISABLED' })
        }

        // Hacer desaparecer campo 'isinactive'
        function hideIsInactiveField(form) {
            let isinactive = form.getField('isinactive');
            isinactive.updateDisplayType({ displayType: 'HIDDEN' })
        }

        // Hacer campos obligatorios
        function makeMandatoryField(form, nombre_campo) { // nombre del campo o id
            form.getField(nombre_campo).isMandatory = true;
        }

        /******************/

        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        function beforeLoad(scriptContext) {

            let { form } = scriptContext;

            disableNameField(form);

            hideIsInactiveField(form);

            makeMandatoryField(form, ALUMNO_RECORD.fields.firstname);
            makeMandatoryField(form, ALUMNO_RECORD.fields.lastname);
            makeMandatoryField(form, ALUMNO_RECORD.fields.email);
            makeMandatoryField(form, ALUMNO_RECORD.fields.phone);
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function beforeSubmit(scriptContext) {

            // Obtener el newRecord
            let { newRecord } = scriptContext;

            // Obtener valores de campos
            let firstname = newRecord.getValue(ALUMNO_RECORD.fields.firstname);
            let lastname = newRecord.getValue(ALUMNO_RECORD.fields.lastname);

            // Formatear valores de campos
            let name = firstname + " " + lastname;
            name = name.trim();

            // Setear valor al campo 'name'
            newRecord.setValue(ALUMNO_RECORD.fields.name, name);
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function afterSubmit(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type } = scriptContext;

            // Si estamos en modo 'create'
            if (type == 'create') {

                // Obtener usuario actual
                let user = runtime.getCurrentUser();

                // Obtener valores de name y email ingresado
                let name = newRecord.getValue(ALUMNO_RECORD.fields.name);
                let recipient = newRecord.getValue(ALUMNO_RECORD.fields.email);

                // Contenido HTML
                let body = `
                    <table border=1>
                        <tr>
                        <td><b>Nombre</b></td>
                        <td>${name}</td>
                        </tr>
                    </table>
                `

                // Enviamos correo
                email.send({
                    author: user.id,
                    recipients: recipient,
                    subject: 'Welcome',
                    body: body
                })
            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
