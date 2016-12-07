import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

class ModifiedBootstrapTable extends BootstrapTable {

  constructor(props) {
    super(props);
  }

  deleteSelected(apiCall) {
    const selectedIds = this.store.getSelectedRowKeys();
    apiCall(selectedIds);
  }

  render() {
    const result = super.render();
    console.log('iihoc=',result);
    return result;
  }
}

export default class Table extends Component {

  handleDeleteButtonClicked() {
    const apiCall = this.props.onDeleteButtonClicked;
    this.refs.table.deleteSelected(apiCall);
    this.props.onDeleteButtonClicked(); // call delete API
  }

  render() {
    const { tableData, onRowClicked, onCreateButtonClicked } = this.props;

    const result = (
      <div>
        <Button onClick={onCreateButtonClicked}>
          <i className="glyphicon glyphicon-plus" />
          New
        </Button>
        <Button onClick={this.handleDeleteButtonClicked.bind(this)}>
          <i className="glyphicon glyphicon-trash" />
          Delete
        </Button>
        <ModifiedBootstrapTable
          ref="table"
          data={tableData}
          height={330}
          hover condensed pagination
          selectRow={{
            mode: 'checkbox',
            bgColor: 'rgb(238, 193, 213)',
          }}
          options={{
            onRowClick: onRowClicked,
          }}
          >
          <TableHeaderColumn dataField="id" dataSort isKey width="150">ID</TableHeaderColumn>
          <TableHeaderColumn dataField="title" dataSort>Title</TableHeaderColumn>
          <TableHeaderColumn dataField="price" dataSort>Price</TableHeaderColumn>
        </ModifiedBootstrapTable>
      </div>
    );
    console.log('elem=',result);
    return result;
  }
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object),
  onRowClicked: PropTypes.func,
  onCreateButtonClicked: PropTypes.func,
  onDeleteButtonClicked: PropTypes.func,
};
