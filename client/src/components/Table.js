import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

class ModifiedBootstrapTable extends BootstrapTable {
  render() {
    const result = super.render();
    console.log('iihoc=',result);
    return result;
  }
}

export default function Table(props) {
  const { tableData, onRowClicked, onDeleted } = props;

  const result = (
    <ModifiedBootstrapTable
      data={tableData}
      height={330}
      hover condensed pagination deleteRow
      selectRow={{
        mode: 'checkbox',
        bgColor: 'rgb(238, 193, 213)',
      }}
      options={{
        onRowClick: onRowClicked,
        afterDeleteRow: onDeleted,
      }}
      >
      <TableHeaderColumn dataField="id" dataSort isKey width="150">ID</TableHeaderColumn>
      <TableHeaderColumn dataField="title" dataSort>Title</TableHeaderColumn>
      <TableHeaderColumn dataField="price" dataSort>Price</TableHeaderColumn>
    </ModifiedBootstrapTable>
  );
  console.log('elem=',result);
  return result;
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object),
  onRowClicked: PropTypes.func,
  onDeleted: PropTypes.func
};
