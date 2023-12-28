// Notas del archivo:
// - Secuencia de comando:
//      - Biomont MR Mi Primer MapReduce Jorge (customscript_jel_bio_mr_miprimermapredu)

/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N'],

    (N) => {

        const { log, runtime, task } = N;

        /******************/

        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {

            log.debug('', '----------------- MapReduceScript -----------------');

            let repe = runtime.getCurrentScript().getParameter('custscript_jel_bio_repe') || 0;

            log.debug('Start Repe', repe);

            return [1, 2, 3, 6, 7, 3, 4, 6, 8, 10, 23, 33]

        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {

            try {

                let value = Number(mapContext.value);
                // log.debug('value', value);

                let type = '';

                if (value % 2 == 0) {
                    type = 'par';
                } else {
                    type = 'impar';
                }

                mapContext.write({ key: type, value: value })

            } catch (err) {
                log.error('Map', err);
            }

        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

            try {

                log.debug('', '-----------------------------------');
                log.debug('reduce - Group Type', reduceContext.key);
                log.debug('reduce - Values ', reduceContext.values);

                reduceContext.write({ key: reduceContext.key, value: reduceContext.values });

            } catch (err) {
                log.error('Reduce', err);
            }

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {

            log.debug('', '-----------------------------------');

            summaryContext.output.iterator().each((key, value) => {
                log.debug('summaryContext - key', key);
                log.debug('summaryContext - value', value);
                return true;
            });

            let repe = runtime.getCurrentScript().getParameter('custscript_jel_bio_repe');

            if (!repe) {
                repe = 0;
            } else {
                repe = Number(repe)
            }

            log.debug('End Repe', '-----------------------------------');


            if (repe < 3) {

                log.debug('Count Repe', repe);

                // Redirigir a este mismo MapReduceScript (Redirigir a si mismo)
                task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    params: {
                        custscript_jel_bio_repe: (repe + 1)
                    }
                }).submit();

            }

        }

        return { getInputData, map, reduce, summarize }

    });
