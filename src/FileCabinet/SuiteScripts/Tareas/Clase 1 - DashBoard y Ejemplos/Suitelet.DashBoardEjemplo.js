/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N'],

    (N) => {

        const { render, file } = N;
        const { serverWidget } = N.ui;

        /******************/

        function getDashBoard() {

            let fileContent = file.load('./index_richard.html').getContents();

            let renderer = render.create();

            renderer.templateContent = fileContent;

            return renderer.renderAsString();

        }

        function onRequest(scriptContext) {

            if (scriptContext.request.method == 'GET') {

                let form = serverWidget.createForm({ title: 'Dashboard Example With HTML' });

                let field = form.addField({
                    id: 'custpage_field_html',
                    label: ' ',
                    type: 'inlinehtml'
                });

                field.defaultValue = getDashBoard();

                scriptContext.response.writePage(form);

            }

        }

        return { onRequest }

    });
