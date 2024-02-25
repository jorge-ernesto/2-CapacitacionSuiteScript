// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SS ListaItemFulfillments Jorge (customscript_jel_bio_ss_listitemffill)

/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N'],

    function (N) {

        const { log, runtime, search, file, email, render, encode } = N;
        const { serverWidget } = N.ui;

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

        // Eliminar archivo
        function deleteFile() {
            let fileObj = null;

            // Buscar archivo
            try {
                fileObj = file.load({
                    id: 'Folder para Almacenar XLS/ReporteMasivo.xls'
                });
                log.audit('file', fileObj);
            } catch (e) {
                log.audit('Archivo no encontrado', 'No se encontro el archivo');
            }

            // Eliminar archivo
            if (fileObj && fileObj.name == 'ReporteMasivo.xls') {
                try {
                    file.delete({ id: fileObj.id });
                    log.audit('Archivo eliminado', 'Se eliminó el archivo ' + fileObj.name);
                } catch (e) {
                    log.error('Error al eliminar archivo', e.message);
                }
            }

            // Verificar proceso
            log.debug('Mensaje', 'Se ejecuto deleteFile');
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
                    // ['mainline', 'is', 'T'] // Cuando no colocamos que mainline es igual a True, NetSuite trae todas las transacciones
                    ['mainline', 'is', 'F'] // Se cambio a False para el ejemplo de ScheduledScript. Para este caso filtrar del 01/05/2023 al 31/05/2023
                ],
            };

            if (start) {
                searchObject.filters.push('AND');
                searchObject.filters.push(['trandate', 'onorafter', start])
            } else {
                searchObject.filters.push('AND');
                searchObject.filters.push(['trandate', 'onorafter', '01/05/2023'])
            }

            if (end) {
                searchObject.filters.push('AND');
                searchObject.filters.push(['trandate', 'onorbefore', end])
            } else {
                searchObject.filters.push('AND');
                searchObject.filters.push(['trandate', 'onorbefore', '31/05/2023'])
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
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        function execute(scriptContext) {

            // Eliminar archivo
            deleteFile();

            // Obtener informacion del ScheduledScript
            let currentScript = runtime.getCurrentScript();
            let start = currentScript.getParameter({ name: 'custscript_jel_bio_startdate' });
            let end = currentScript.getParameter({ name: 'custscript_jel_bio_enddate' });
            log.debug('Start', start);
            log.debug('End', end);

            // Obtener datos por search
            let transactionList = getSearchResultItemFulfillments(start, end);

            /****************** EXCEL ******************/
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
                        transactions: transactionList
                    })
                }
            });

            // Crear XLS
            let rendererString = renderer.renderAsString();
            let xlsFile = createXLSFile(rendererString);

            // Reescribir datos de Excel
            // Carpetas:
            // -15: Es la carpeta 'SuiteScript'
            // 27757: Es la carpeta 'Folder para Almacenar XLS'
            xlsFile.name = 'ReporteMasivo.xls'; // `ReporteMasivo_${new Date().getTime()}.xls`
            xlsFile.folder = 27757;
            xlsFile.save();
        }

        return { execute }

    });
