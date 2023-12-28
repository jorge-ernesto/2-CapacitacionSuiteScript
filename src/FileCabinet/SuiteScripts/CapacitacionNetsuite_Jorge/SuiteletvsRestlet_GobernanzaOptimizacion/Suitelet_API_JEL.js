// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL SuiteletComoAPIWithToken (customscript_jel_bio_sl_slasapiwithtoken)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N'],

    (N) => {

        const { log, search, record, runtime, file, url } = N;

        /******************/

        function validateEmployee(token) {

            if (!token) return null;

            let name = '';

            search.create({
                type: 'employee',
                columns: ['firstname', 'lastname'],
                filters: [
                    ['custentity_bm_token_r', 'is', token]
                ]
            }).run().each(node => {

                name = node.getValue(node.columns[0]) + " " + node.getValue(node.columns[1]);
                return false;
            });

            return name;
        }

        const onRequest = (scriptContext) => {

            if (scriptContext.request.method == 'POST') {

                // Tipo de contenido a enviar o recibir
                scriptContext.response.setHeader('Content-Type', 'application/json');

                // Recibir Token
                let headers = scriptContext.request.headers;
                let token = headers["x-biomont-conection"];

                // Validar Token
                let employee = validateEmployee(token);

                if (employee) {

                    // Debug
                    log.error('Current User', runtime.getCurrentUser());

                    // Repuesta success
                    scriptContext.response.write(JSON.stringify({
                        status: true,
                        message: 'Welcome :' + employee
                    }));

                    // Respuesta success
                    var host = url.resolveDomain({
                        hostType: url.HostType.APPLICATION,
                        accountId: runtime.accountId
                    });

                    let path = file.load(26018).url;

                    scriptContext.response.write(JSON.stringify({
                        url: "https://" + host + "" + path
                    }));
                } else {

                    // Respuesta error
                    scriptContext.response.write(JSON.stringify({
                        status: false,
                        message: 'Not Access'
                    }))
                }
            }
        }

        let x = {
            "id": -4,
            "name": "-Sistema-",
            "email": "onlineformuser@6462530-sb1.com",
            "location": 0,
            "department": 0,
            "role": 31,
            "roleId": "online_form_user",
            "roleCenter": "CUSTOMER",
            "subsidiary": 1
        }

        return { onRequest }

    });
