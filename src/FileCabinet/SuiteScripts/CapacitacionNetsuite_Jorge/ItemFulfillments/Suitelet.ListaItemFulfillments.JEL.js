// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL ListaItemFulfillments Jorge (customscript_jel_bio_sl_listitemffill)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N'],

    function (N) {

        const { log, runtime, search, file, email, render, encode, task, redirect } = N;
        const { serverWidget, message } = N.ui;

        const send_email = false;
        const send_scheduled_script = true;

        /******************/

        // Crear XLS
        function createXLSFile(content) {

            let base64fileEncodedString = encode.convert({
                string: content,
                inputEncoding: encode.Encoding.UTF_8,
                outputEncoding: encode.Encoding.BASE_64
            });

            return file.create({
                name: 'Reporte.xls',
                fileType: file.Type.EXCEL,
                encoding: file.Encoding.UTF_8,
                contents: base64fileEncodedString,
            })
        }

        /******************/

        function getSearchResultItemFulfillments(start, end) {
            log.debug('getSearchResultItemFulfillments');

            // Array donde guardaremos la informacion
            let resultArray = [];

            // Filtro de search
            let searchObject = {
                type: 'itemfulfillment',
                columns: ['tranid', 'entity', 'trandate', 'custbody_ns_series_cxc', 'custbody_ns_num_correlativo'],
                filters: [
                    ['mainline', 'is', 'T'] // Cuando no colocamos que mainline es igual a True, NetSuite trae todas las transacciones
                    // ['mainline', 'is', 'F'] // Se cambio a False para el ejemplo de ScheduledScript. Para este caso filtrar del 01/05/2023 al 31/05/2023
                ],
            };

            if (start) {
                searchObject.filters.push('AND');
                searchObject.filters.push(['trandate', 'onorafter', start])
            }

            if (end) {
                searchObject.filters.push('AND');
                searchObject.filters.push(['trandate', 'onorbefore', end])
            }

            // Crear search - con mas de 4000 registros
            let searchContext = search.create(searchObject);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {

                    // Obtener informacion - getValue
                    // let { columns } = row;
                    // let tranid = row.getValue(columns[0]);
                    // let entity = row.getValue(columns[1]);
                    // let trandate = row.getValue(columns[2]);
                    // let serie = row.getValue(columns[3]);
                    // let correlativo = row.getValue(columns[4]);

                    // Obtener informacion - getValue, getText
                    let { columns } = row;
                    let tranid = row.getValue(columns[0]);
                    let entity = row.getText(columns[1]); // Obtenemos el text y no solo el value
                    let trandate = row.getValue(columns[2]);
                    let serie = row.getText(columns[3]); // Obtenemos el text y no solo el value
                    let correlativo = row.getValue(columns[4]);

                    // Insertar informacion en array
                    resultArray.push({ tranid, entity, trandate, serie, correlativo });
                });
            });

            return resultArray;
        }

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // scriptContext.response.write(), acepta HTML
            // scriptContext.response.writePage(), acepta serverWidget
            // scriptContext.response.writeFile(), acepta files

            // response.write()
            // let text = 'Hello World';
            // let texto = `<body>
            //                 <b>Hello World</b>
            //             </body>`;
            // scriptContext.response.write(texto);

            // response.writePage()
            // let form = serverWidget.createForm({
            //     title: 'Lista de Items Fulfillments',
            //     hideNavbar: false
            // })
            // let htmlField = form.addField({
            //     id: 'custpage_field_html',
            //     type: 'inlinehtml',
            //     label: ' ',
            // });
            // let textoHtml = `<b style="font-size: 24px">HELLO WORLD</b>`;
            // htmlField.defaultValue = textoHtml;
            // scriptContext.response.writePage(form);

            if (scriptContext.request.method == 'GET') {

                /****************** FORMULARIO ******************/
                // Crear formulario
                let form = serverWidget.createForm({
                    title: 'Lista de Items Fulfillments',
                    hideNavbar: false
                })

                form.addSubmitButton({
                    label: 'Exportar/Enviar'
                })

                // Asociar ClientScript al formulario
                form.clientScriptModulePath = './Client.ListaItemFulfillments.JEL';

                // Mostrar boton personalizado
                form.addButton({
                    id: 'custpage_button',
                    label: 'Filtrar',
                    functionName: 'ejecutarBoton()'
                });

                form.addButton({
                    id: 'custpage_button_2',
                    label: 'Descargar',
                    functionName: 'descargar()'
                });

                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group',
                    label: 'Filters',
                })

                let criteriaStart = form.addField({
                    id: 'custpage_field_from',
                    label: 'Date From',
                    type: 'DATE',
                    container: 'custpage_group'
                })

                let criteriaEnd = form.addField({
                    id: 'custpage_field_to',
                    label: 'Date To',
                    type: 'DATE',
                    container: 'custpage_group'
                })

                /****************** BUSQUEDA GUARDADA ******************/
                // Declarar parametros
                let start = null;
                let end = null;
                let isProcess = 'F';

                // Recibir parametros por url
                // Agregar esto a la url para probar ---- &_start=05/08/2022&_end=05/08/2022
                if (scriptContext.request.parameters) {
                    start = scriptContext.request.parameters['_start'];
                    end = scriptContext.request.parameters['_end'];
                    isProcess = scriptContext.request.parameters['isProcess'];
                }

                // Si hubo una redireccion a este mismo suitelet, despues de enviar a script programado
                if (isProcess == 'T') {
                    form.addPageInitMessage({
                        type: message.Type.INFORMATION,
                        message: `
                        Se esta creando un archivo en el FileCabinet (Archivador) <br /><br />
                        Puedes buscarlo de las siguientes maneras: <br />
                            - Documentos -> Archivos -> Archivador -> Buscar, con la palabra clave 'ReporteMasivo.xls' <br />
                            - En tu correo con el nombre 'ReporteMasivo.xls' <br />
                        `,
                        duration: 25000
                    });
                }

                // Setear valores a formulario
                if (start) {
                    criteriaStart.defaultValue = start;
                }
                if (end) {
                    criteriaEnd.defaultValue = end;
                }

                // Obtener datos por search
                // let start = new Date();
                let itemfulfillmentList = getSearchResultItemFulfillments(start, end);
                // let end = new Date();

                // Testear cuanto demora la transaccion
                // log.debug('Total Lines', itemfulfillmentList.length);
                // log.debug('Total Time (s)', (end.getTime() - start.getTime()) / 1000);
                // log.debug('Available Memory', runtime.getCurrentScript().getRemainingUsage());

                /****************** SUBLISTA ******************/
                // Agregar sublista
                let sublist = form.addSublist({
                    id: 'custpage_sublist_result',
                    type: 'STATICLIST', // LIST, STATICLIST, EDITOR, INLINEEDITOR
                    label: 'Items Fulfillments'
                });

                // Setear cabecera a sublista
                sublist.addField({ id: 'custpage_col_tranid', type: 'text', label: 'Tran Id' });
                sublist.addField({ id: 'custpage_col_entity', type: 'text', label: 'Entity' });
                // let colEntity = sublist.addField({ id: 'custpage_col_entity', type: 'select', label: 'Entity', source: 'customer' }); // Esto debe recibir el getValue, no  getText
                sublist.addField({ id: 'custpage_col_trandate', type: 'text', label: 'Date' });
                sublist.addField({ id: 'custpage_col_serie', type: 'text', label: 'Serie' });
                sublist.addField({ id: 'custpage_col_correlativo', type: 'text', label: 'Correlativo' });

                // Setear propiedad a columa colEntity
                // colEntity.updateDisplayType({
                //     displayType: serverWidget.FieldDisplayType.INLINE
                // })

                // Setear los datos obtenidos a sublista

                // Ciclo forEach
                // itemfulfillmentList.forEach((element, i) => {
                //     let { tranid, entity, trandate, serie, correlativo } = element;
                // });

                // Ciclo for
                // for (let i = 0; i < itemfulfillmentList.length; i++) {
                //     let { tranid, entity, trandate, serie, correlativo } = itemfulfillmentList[i];
                // }

                // Ciclo for
                for (let i = 0; i < itemfulfillmentList.length; i++) {
                    let { tranid, entity, trandate, serie, correlativo } = itemfulfillmentList[i];

                    if (tranid) {
                        sublist.setSublistValue({ id: 'custpage_col_tranid', line: i, value: tranid });
                    }
                    if (entity) {
                        sublist.setSublistValue({ id: 'custpage_col_entity', line: i, value: entity });
                    }
                    if (trandate) {
                        sublist.setSublistValue({ id: 'custpage_col_trandate', line: i, value: trandate });
                    }
                    if (serie) {
                        sublist.setSublistValue({ id: 'custpage_col_serie', line: i, value: serie });
                    }
                    if (correlativo) {
                        sublist.setSublistValue({ id: 'custpage_col_correlativo', line: i, value: correlativo });
                    }
                }

                /****************** RENDERIZAR FORMULARIO ******************/
                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST

                // Recibir parametros por POST
                let start = scriptContext.request.parameters['custpage_field_from'];
                let end = scriptContext.request.parameters['custpage_field_to'];

                // Validar que solo se pueda hacer una de las dos acciones
                if (send_email == true && send_scheduled_script == true) {
                    throw 'No puede enviar email y ejecutar script programado a la vez'
                }

                // Enviar email
                if (send_email == true) {
                    // Obtener datos por search
                    let resultadoItem = getSearchResultItemFulfillments(start, end);

                    /****************** CSV ******************/
                    // Crear CSV
                    let csvData = [];

                    resultadoItem.forEach((element, i) => {
                        let current = [];
                        current.push(element.tranid);
                        current.push(element.entity);
                        current.push(element.trandate);
                        current.push(element.serie);
                        current.push(element.correlativo);

                        current = current.join(';');
                        csvData.push(current);
                    });
                    csvData = csvData.join("\r\n");

                    let csvFile = file.create({
                        name: 'resultado.csv',
                        fileType: file.Type.CSV,
                        contents: csvData,
                        encoding: file.Encoding.UTF_8,
                    });

                    /****************** Excel ******************/
                    // Crear Excel
                    // let xlsContent = file.load('./template/Excel/reporte_richard.ftl').getContents();
                    // let xlsFile = createXLSFile(xlsContent);

                    // Crear Excel - Contenido dinamico
                    let xlsContent = file.load('./template/Excel/reporte_contenido_dinamico_richard.ftl').getContents();
                    let renderer = render.create();
                    renderer.templateContent = xlsContent;

                    // Enviar datos a Excel
                    renderer.addCustomDataSource({
                        format: render.DataSource.OBJECT,
                        alias: "input",
                        data: {
                            data: JSON.stringify({
                                name: 'Richard Adrian Galvez Lopez',
                                transactions: resultadoItem
                            })
                        }
                    });

                    // Crear XLS
                    let rendererString = renderer.renderAsString();
                    let xlsFile = createXLSFile(rendererString);

                    /****************** PDF ******************/

                    // Crear PDF
                    // Archivos:
                    // - pdf_reporte_richard_creating_xml
                    // - pdf_reporte_richard_applying_stylesheets
                    let pdfContent = file.load('./template/PDF/pdfreport_applying_stylesheets_richard.ftl').getContents();
                    let rendererPDF = render.create();
                    rendererPDF.templateContent = pdfContent;
                    // Enviar datos a PDF
                    // ...
                    // Fin Enviar datos a PDF
                    let pdfFile = rendererPDF.renderAsPdf();
                    pdfFile.name = 'Reporte PDF.pdf';

                    /****************** Email ******************/
                    // Enviar email
                    let user = runtime.getCurrentUser();

                    email.send({
                        author: user.id,
                        recipients: ['jorge.cywdt@gmail.com', 'jlachira@biomont.com'],
                        subject: 'Ejemplo con Archivo',
                        body: 'Mensaje con Archivo',
                        attachments: [csvFile, xlsFile, pdfFile] // [csvFile]
                    });
                }

                // Enviar a script programado
                if (send_scheduled_script == true) {
                    // Crear tarea - Enviar a ScheduledScript (Script Programado)
                    // Se puede enviar a ScheduledScript, usando task.TaskType.SCHEDULED_SCRIPT
                    // Se puede enviar a MapReduceScript, usando task.TaskType.MAP_REDUCE
                    let taskId = task.create({
                        taskType: task.TaskType.SCHEDULED_SCRIPT,
                        scriptId: 'customscript_jel_bio_ss_listitemffill',
                        deploymentId: 'customdeploy_jel_bio_ss_listitemffill',
                        params: {
                            custscript_jel_bio_startdate: start,
                            custscript_jel_bio_enddate: end
                        }
                    }).submit();

                    // Revisar task status
                    // let taskStatus = task.checkStatus({
                    //     taskId: taskId
                    // });
                    // log.debug('taskStatus', taskStatus)

                    // Redirigir a este mismo Suitelet (Redirigir a si mismo)
                    redirect.toSuitelet({
                        scriptId: runtime.getCurrentScript().id,
                        deploymentId: runtime.getCurrentScript().deploymentId,
                        parameters: {
                            '_start': start,
                            '_end': end,
                            'isProcess': 'T'
                        }
                    });
                }
            }
        }

        return { onRequest }

    });
