// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Alumnos Jorge (customscript_jel_bio_ue_alumnos)
// - Registro:
//      - Alumnos Jorge (customrecord_jel_alumnos)

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N'],

    function (N) {

        const { log, runtime, record, search, email } = N;
        const { serverWidget } = N.ui;

        /******************/

        function getSupervisorList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customrecord_jel_sup_alumnos',
                columns: ['internalid', 'name'],
                // filters: [
                //     ['name', 'contains', '1']
                // ],
            });

            // Modos de recorrer un search
            // run().each();
            // run().getRange(0, 1000); // run().getRange(1000, 2000); // run().getRange(2000, 3000); // getRange recorre 1000 lineas a la vez
            // runPaged();

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
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

            // Obtener el newRecord y type
            let newRecord = scriptContext.newRecord;
            let type = scriptContext.type;
            let form = scriptContext.form;

            // Agregar boton personalizado
                // Si type es diferente de view, no hace nada
                // if (type != 'view') {
                //     return
                // }

                // Si type es igual a view, agrega el boton
                if (type == 'view' || type == 'create') {
                    // Asociar ClientScript al formulario
                    form.clientScriptModulePath = './Client.RecordAlumno.JEL';

                    // Mostrar boton personalizado
                    form.addButton({
                        id: 'custpage_miprimerboton',
                        label: 'Mi Primer Boton',
                        functionName: 'ejecutarBoton()'
                    });
                }

            // Agregar campo personalizado
                form.addField({
                    id: 'custpage_campo',
                    type: 'text',
                    label: 'Campo Personalizado'
                });

            // Agregar select personalizado
                // Agregar campo supervisor personalizado con source
                form.addField({
                    id: 'custpage_supervisor_source',
                    type: 'select',
                    label: 'Supervisor Personalizado (Source)',
                    source: 'customrecord_jel_sup_alumnos'
                });

                // Agregar campo supervisor personalizado con datos obtenidos por modulo search
                let fieldSupervisorSearch = form.addField({
                    id: 'custpage_supervisor_search',
                    type: 'select',
                    label: 'Supervisor Personalizado (Search)'
                });

                // Obtener datos por search
                let supervisorList = getSupervisorList();

                // Setear un primer valor vacio
                fieldSupervisorSearch.addSelectOption({
                    value: '',
                    text: ''
                });

                // Setear los datos obtenidos manualmente al campo supervisor personalizado
                supervisorList.forEach((element, i) => {
                    fieldSupervisorSearch.addSelectOption({
                        value: element.id,
                        text: element.name
                    })
                })

                // Hacer que el campo sea obligatorio
                fieldSupervisorSearch.isMandatory = true;

            // Setear propiedad a campo del formulario - Buscar la documentación del modulo N/ui/serverWidget
                // Recuperar un campo del formulario
                let field = form.getField({
                    id: 'custrecord_jel_alumno_firstname'
                });

                // Convertir en disabled un campo
                field.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });

                // Mover a la parte inferior un campo
                field.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.OUTSIDEBELOW
                })

            // Obtener el supervisor personalizado por url
                let defaultSupervisor = null;

                if (scriptContext.request) {
                    let params = scriptContext.request.parameters;

                    if (params) {
                        defaultSupervisor = params["supervisor"]
                        fieldSupervisorSearch.defaultValue = defaultSupervisor
                    }
                }
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

            /******************/
            // Esto se ejecutara en todos los modos (create, edit, view, etc.)
            // En beforeSubmit (Antes de enviar):
            //      - En modo create: No existe el id
            //      - En modo edit  : Si existe el id
            // log.debug('beforeSubmit', '-----------------------')
            // log.debug('beforeSubmit scriptContext.type', scriptContext.type);
            // log.debug('beforeSubmit scriptContext.newRecord.id', scriptContext.newRecord.id);

            // Contexto de Ejecución
            // - Un UserEventScript se puede ejecutar mediante Interfaz de Usuario, por ejemplo usando el modulo 'N/record' en un ClientScript
            // - Revisar la funcion 'ejecutarBoton' en el archivo 'Client.RecordAlumno.JEL.js', donde se creo un boton y donde se uso el modulo 'N/Record'
            // - Revisar la funcion 'beforeLoad' en el archivo 'UserEvent.RecordAlumno.JEL', donde se verifica el 'Contexto de Ejecución' y donde se detiene el script al 'Editar'
            // - La palabra clave en un 'Contexto de Ejecución' para representar Interfaz de Usuario es 'USERINTERFACE'
            // log.debug('beforeSubmit', '-----------------------')
            // log.debug('Runtime', runtime.executionContext)

            // Detener envio
            // if (scriptContext.type == 'edit') {
            //     throw 'Me cai porque estoy editando';
            // }

            /******************/

            // Obtener el newRecord
            // let { newRecord } = scriptContext;

            // Setear el valor del campor lastname
            // newRecord.setValue({
            //     fieldId: 'custrecord_jel_alumno_lastname',
            //     value: 'Me llene automaticamente',
            //     ignoreFieldChange: true
            // })

            /******************/

            // Revisar los value de los campos personalizados
            // log.debug('Campo Personalizado', newRecord.getValue('custpage_campo'))
            // log.debug('Supervisor Personalizado (Source) Value', newRecord.getValue('custpage_supervisor_source'))
            // log.debug('Supervisor Personalizado (Source) Text', newRecord.getText('custpage_supervisor_source'))
            // log.debug('Supervisor Personalizado (Search) Value', newRecord.getValue('custpage_supervisor_search'))
            // log.debug('Supervisor Personalizado (Search) Text', newRecord.getText('custpage_supervisor_search'))
            // log.debug('Supervisor Value', newRecord.getValue('custrecord_jel_supervisor'))
            // log.debug('Supervisor Text', newRecord.getText('custrecord_jel_supervisor'))
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

            // Solo se ejecutara en modo create
            if (scriptContext.type == 'create') {

                // Obtiene el usuario actual
                let user = runtime.getCurrentUser();

                // Envia correo
                email.send({
                    author: user.id,
                    recipients: ['jorge.cywdt@gmail.com', 'jlachira@biomont.com'],
                    subject: 'Prueba Modulo Email',
                    body: '<b>MI PRIMER CORREO ELECTRONICO<b>',
                })
            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit };

    });
