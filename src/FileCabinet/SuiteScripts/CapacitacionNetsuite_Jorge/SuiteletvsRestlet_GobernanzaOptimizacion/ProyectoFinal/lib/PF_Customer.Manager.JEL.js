/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N', 'require'],

  function (N, require) {

    const { search, record, file } = N;

    const CUSTOMER_RECORD = {
      type: 'customer',
      fields: {
        'companyname': 'companyname',
        'email': 'email',
        'email_FE': 'custentity24'
      }
    }

    function createCusomter() {

    }

    function updateCusomter() {

    }

    function viewCustomer() {

    }

    // Mala ejecucion de una busqueda
    // 10 + 10N  
    function listCustomer() {

      let resultSet = [];

      let searchData = search.create({
        type: CUSTOMER_RECORD.type,
        columns: ['internalid']
      });

      let searchResult = searchData.run().getRange(0, 10);

      for (var i = 0; i < searchResult.length; i++) {
        let row = searchResult[0];
        let customerId = row.getValue(row.columns[0]);

        let currentRecord = record.load({ type: CUSTOMER_RECORD.type, id: customerId });

        resultSet.push({
          companyname: currentRecord.getValue(CUSTOMER_RECORD.fields.companyname),
          email: currentRecord.getValue(CUSTOMER_RECORD.fields.email),
          email_FE: currentRecord.getValue(CUSTOMER_RECORD.fields.email_FE),
        })

      }

      return resultSet;
    }


    // Busqueda Optimizada
    // 10 
    function listCustomerV2() {
      let resultSet = [];

      let searchData = search.create({
        type: CUSTOMER_RECORD.type,
        columns: [
          'internalid',
          CUSTOMER_RECORD.fields.companyname,
          CUSTOMER_RECORD.fields.email,
          CUSTOMER_RECORD.fields.email_FE
        ]
      });

      let searchResult = searchData.run().getRange(0, 10);

      for (var i = 0; i < searchResult.length; i++) {
        let row = searchResult[0];
        let customerId = row.getValue(row.columns[0]);

        resultSet.push({
          companyname: row.getValue(row.columns[1]),
          email: row.getValue(row.columns[2]),
          email_FE: row.getValue(row.columns[3]),
        })

      }

      return resultSet;
    }


    // Cuando usar submit o Record.load
    // 5m + 10m
    // 15m
    function usingRecordLoad() {

      let recordContext = record.load({ type: 'customer', id: 1 });

      recordContext.setValue('X', value);

      recordContext.save();

    }

    // 5m
    function updateRecordWithoutLoad() {

      let recordContext = record.submitFields({
        type: 'customer',
        id: 1,
        values: {
          'X': value
        }
      });

    }

    /*****************************************************************/

    // Campos : name, email, phone

    // Si necesitas obtener valores de la sublistas
    // 5m
    function getFieldsOfCustomer() {

      let recordContext = record.load({ type: 'customer', id: 1 });

      return {
        name: recordContext.getValue('name'),
        email: recordContext.getValue('email'),
        phone: recordContext.getValue('phone')
      }
    }

    // createFilter
    // Usar esta funcion cuando quieras filtrar por id interno (Se pasan los id interno en un array)
    // Buscar palabra clave 'createFilter' en todos los proyectos
    // 10m
    function getFieldOfCustomerSearch() {

      let searchContext = search.create({
        type: 'customer',
        columns: ['name', 'email', 'phone'],
        filters: [
          {
            name: 'internalid',
            operator: 'anyof',
            values: [1]
          }
        ]
      }).run().getRange(0, 1)

      if (searchContext.length > 0) {

        let currentRow = searchContext[0];

        return {
          name: currentRow.getValue(currentRow.columns[0]),
          email: currentRow.getValue(currentRow.columns[1]),
          phone: currentRow.getValue(currentRow.columns[2])
        }

      }
    }

    // Cuando necesitas campos de cabecera de una record en especifico.
    // no soportar sublistas
    // 1m
    function getFieldsUsingLookUpFieldsSearch() {
      let searchContext = search.lookupFields({
        type: 'customer',
        id: 1,
        columns: ['name', 'email', 'phone']
      });

      return {
        name: searchContext.name,
        email: searchContext.email,
        phone: searchContext.phone
      }
    }

    /*****************************************************************/

    // Usando el modulo Require

    function loadApexChartLibrary() {

      let Lib = null

      try {
        require(['SuiteScripts/CapacitacionNetSuite_Richard/ProyectoFinal/public/apexchart.js'], function (lib) { Lib = lib; })
      } catch (err) {

        try {
          require(['../public/apexchart'], function (lib) { Lib = lib; });
        } catch (err) {

          search.create({
            type: 'file',
            columns: ['internalid'],
            filters: [
              ['name', 'is', 'apexchart.js']
            ]
          }).run().each(node => {
            let currentFile = file.load(node.getValue(node.columns[0]));
            require([currentFile.path], function (lib) {
              Lib = lib;
            })
            return false;
          })

        }
      }
    }


    class CustomerFactory {

      constructor() {

      }

      create() { }

      update() { }

      view() { }

      list() { }

    }

    return {
      create: createCusomter,
      update: updateCusomter,
      view: viewCustomer,
      list: listCustomer,
      list_v2: listCustomerV2
    }

  });
