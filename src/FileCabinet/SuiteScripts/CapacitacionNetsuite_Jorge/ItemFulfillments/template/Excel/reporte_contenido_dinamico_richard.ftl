<!--
  <#assign a = "Hola Mundo">
  ${a}
-->
<!-- Evaluamos contenido de input.data, eval convierte un dato string a JSON -->
<#assign params = input.data?eval>
<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <!-- Estilos -->
  <ss:Styles>
    <ss:Style ss:ID="t1">
      <ss:Alignment ss:Horizontal="Right" />
      <ss:Font ss:Bold="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
      </Borders>
    </ss:Style>
    <ss:Style ss:ID="header">
      <ss:Font ss:Bold="1" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
      </Borders>
    </ss:Style>
    <ss:Style ss:ID="background">
      <Alignment ss:Horizontal="Right" ss:Vertical="Bottom" />
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FFFFFF" />
      </Borders>
    </ss:Style>
    <ss:Style ss:ID="cell">
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#DCDCDC" />
      </Borders>
    </ss:Style>
  </ss:Styles>
  <!-- Hoja Excel -->
  <Worksheet ss:Name="Reporte Comparativo">
    <Table ss:StyleID="background">
      <!-- Definimos el tamaño de las columnas -->
      <Column ss:Width="200" />
      <Column ss:Width="90" />
      <Column ss:Width="90" />
      <Column ss:Width="90" />
      <Column ss:Width="90" />
      <Row> <!-- Fila -->
        <Cell ss:StyleID="t1">
          <Data ss:Type="String">Apellidos, Nombres</Data>
        </Cell>
        <Cell ss:StyleID="cell" ss:MergeAcross="1">
          <Data ss:Type="String">${params.name}</Data>
        </Cell>
      </Row>
      <Row> <!-- Fila -->
        <Cell ss:StyleID="t1">
          <Data ss:Type="String">Edad</Data>
        </Cell>
        <Cell ss:StyleID="cell" ss:MergeAcross="1">
          <Data ss:Type="String">27</Data>
        </Cell>
      </Row>
      <Row></Row> <!-- Fila -->
      <Row> <!-- Fila -->
        <Cell ss:StyleID="header">
          <Data ss:Type="String">Transaction</Data>
        </Cell>
        <Cell ss:StyleID="header">
          <Data ss:Type="String">Entity</Data>
        </Cell>
        <Cell ss:StyleID="header">
          <Data ss:Type="String">Date</Data>
        </Cell>
        <Cell ss:StyleID="header">
          <Data ss:Type="String">Serie</Data>
        </Cell>
        <Cell ss:StyleID="header">
          <Data ss:Type="String">Correlativo</Data>
        </Cell>
      </Row>
      <#list params.transactions as line>
      <Row> <!-- Fila -->
        <Cell ss:StyleID="cell">
          <Data ss:Type="String">${line.tranid}</Data>
        </Cell>
        <Cell ss:StyleID="cell">
          <Data ss:Type="String">${line.entity}</Data>
        </Cell>
        <Cell ss:StyleID="cell">
          <Data ss:Type="String">${line.trandate}</Data>
        </Cell>
        <Cell ss:StyleID="cell">
          <Data ss:Type="String">${line.serie}</Data>
        </Cell>
        <Cell ss:StyleID="cell">
          <Data ss:Type="String">${line.correlativo}</Data>
        </Cell>
      </Row>
      </#list>
    </Table>
  </Worksheet>
</Workbook>