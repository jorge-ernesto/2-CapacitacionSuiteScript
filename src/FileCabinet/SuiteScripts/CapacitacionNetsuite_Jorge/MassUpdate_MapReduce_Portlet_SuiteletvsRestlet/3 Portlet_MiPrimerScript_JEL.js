/**
 * @NApiVersion 2.1
 * @NScriptType Portlet
 */
define(['N'],

    function (N) {

        const { file, search } = N;
        const Render = N.render;

        /******************/

        function getTableHtml() {

            let html = file.load('./template/tabla_richard.html').getContents();

            let renderer = Render.create();

            renderer.templateContent = html;

            let result = [];

            search.create({
                type: 'employee',
                columns: ['entityid', 'email', 'phone'],
                filters: [
                    ['giveaccess', 'is', 'T']
                ]
            }).run().each(node => {

                let name = node.getValue(node.columns[0]);
                let email = node.getValue(node.columns[1]);
                let phone = node.getValue(node.columns[2]);

                result.push({ name, email, phone })
                return true;
            })


            renderer.addCustomDataSource({
                alias: 'input',
                format: Render.DataSource.OBJECT,
                data: {
                    data: JSON.stringify({
                        employees: result
                    })
                }
            });

            return renderer.renderAsString();

        }

        /**
         * Defines the Portlet script trigger point.
         * @param {Object} params - The params parameter is a JavaScript object. It is automatically passed to the script entry
         *     point by NetSuite. The values for params are read-only.
         * @param {Portlet} params.portlet - The portlet object used for rendering
         * @param {string} params.column - Column index forthe portlet on the dashboard; left column (1), center column (2) or
         *     right column (3)
         * @param {string} params.entity - (For custom portlets only) references the customer ID for the selected customer
         * @since 2015.2
         */
        const render = (params) => {

            params.portlet.title = 'My Portlet (R)';
            var content = getTableHtml();
            params.portlet.html = content;

        }

        return { render }

    });
