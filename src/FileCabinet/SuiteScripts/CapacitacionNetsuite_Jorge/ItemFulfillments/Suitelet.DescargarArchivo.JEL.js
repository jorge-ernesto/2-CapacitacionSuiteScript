// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Descargar Archivo Jorge (customscript_jel_bio_sl_descargararchivo)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
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

            if (scriptContext.request.method == 'GET') {

                /****************** BUSQUEDA GUARDADA ******************/
                // Declarar parametros
                let start = null;
                let end = null;

                // Recibir parametros por url
                // Agregar esto a la url para probar ---- &_start=05/08/2022&_end=05/08/2022
                if (scriptContext.request.parameters) {
                    start = scriptContext.request.parameters['_start'];
                    end = scriptContext.request.parameters['_end'];
                }

                // Si no obtiene valores se detiene el script
                if (!start && !end) {
                    return
                }

                // Obtener datos por search
                let transactionList = getSearchResultItemFulfillments(start, end);

                /****************** EXCEL ******************/
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

                // Descargar Excel
                scriptContext.response.writeFile({
                    file: xlsFile
                });
            }
        }

        return { onRequest }

    });
