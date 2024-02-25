// Notas del archivo:
// - Secuencia de comando:
//      - Biomont MU Mi Primer MassUpdate Jorge (customscript_jel_bio_mu_miprimermassupd)

/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N'],

    (N) => {

        const { log, runtime } = N;

        /******************/

        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {

            log.debug('Line : ', params.id + ' ' + params.type);
            log.debug('Memory : ', runtime.getCurrentScript().getRemainingUsage());
            log.debug('', '---------------------------------');

        }

        return { each }

    });
