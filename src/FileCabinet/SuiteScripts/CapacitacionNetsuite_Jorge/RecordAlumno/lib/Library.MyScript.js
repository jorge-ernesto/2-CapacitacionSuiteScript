/*
Probar script en la consola de "Set Preferences"

> require(['SuiteScripts/CapacitacionNetsuite_Jorge/RecordAlumno/lib/Library.MyScript.js'], function(lib){
    Lib = lib;
})
> Lib
> Lib.suma(1, 2)
> Lib.createAlumno()
*/

/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        // NApiVersion 2.0
        // var log = N.log;
        // var search = N.search;

        // NApiVersion 2.1
        // const { log, search } = N;

        const { log, record } = N;

        /******************/

        function suma(a, b) {

            log.debug('Suma');
            return Number(a) + Number(b);

        }

        function createAlumno() {

            log.debug('createAlumno');
            let recordAlumno = record.create({ type: 'customrecord_jel_alumnos' });
            recordAlumno.setValue('name', 'Ernesto');
            recordAlumno.setValue('custrecord_jel_alumno_phone', "1234567");
            return recordAlumno.save();

        }

        return { suma, createAlumno }

    });
