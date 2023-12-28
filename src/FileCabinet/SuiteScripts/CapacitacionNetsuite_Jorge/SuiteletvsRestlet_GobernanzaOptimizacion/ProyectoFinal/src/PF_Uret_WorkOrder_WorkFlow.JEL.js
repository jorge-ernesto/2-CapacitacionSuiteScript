/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N'],

    function (N) {

        const { record, search } = N;
        const { serverWidget } = N.ui;

        function printHTMLButtons() {

            let html = `
            <script>

                function showMessage(){

                    require(['N/currentRecord'],function(currentRecord){
                        console.log(currentRecord.get());
                        alert("Hello World");

                    })
                }
                setTimeout(function(){
                    alert("Cargo la Pagina");
                }, 1000);

            </script>
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/components/button.min.css" />
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/components/icon.min.css" />
                <button type="button" class="ui mini labeled icon button" onClick="showMessage()">
                    <i class="pause icon"></i>
                    Pause
                </button>
                <button type="button" class="ui mini right labeled icon button">
                    <i class="right arrow icon"></i>
                    Next
                </button>
                <button type="button" class="ui mini labeled icon button">
                    <i class="loading spinner icon"></i>
                    Loading
                </button>
            `

            return html;
        }

        function beforeLoad(scriptContext) {

            if (scriptContext.type != 'view') return;

            let form = scriptContext.form;
            let newRecord = scriptContext.newRecord;

            let htmlField = form.addField({ id: 'custpage_field_html_date', label: ' ', type: 'inlinehtml' });

            form.insertField({
                field: htmlField,
                nextfield: 'assemblyitem'
            });

            htmlField.defaultValue = printHTMLButtons();

            let itemCount = newRecord.getLineCount('item');

            for (var i = 0; i < itemCount; i++) {

                let lineHTML = `
                 <button type="button" class="" onClick="showMessage(${i})">
                    Go
                </button>
                `;
                newRecord.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_html_1',
                    line: i,
                    value: lineHTML
                })

            }





        }

        return { beforeLoad }

    });
