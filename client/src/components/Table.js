import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

class ModifiedBootstrapTable extends BootstrapTable {

  deleteSelected(callBack) {
    const selectedIds = this.store.getSelectedRowKeys();
    callBack(selectedIds);
    this.store.setSelectedRowKey([]);
  }

  render() {
    const result = super.render();
    console.log('iihoc=',result);
    return result;
  }
}

export default class Table extends Component {

  handleDeleteButtonClicked() {
    this.refs.table.deleteSelected((ids) => {
      this.props.onDeleteButtonClicked(ids); // call delete API
    });
  }

  render() {
    const { tableData, onRowClicked, onCreateButtonClicked } = this.props;

    const Buttons = (props) => (
      <div>
        <Button onClick={onCreateButtonClicked}>
          <i className="glyphicon glyphicon-plus" />
          Create
        </Button>
        <Button onClick={this.handleDeleteButtonClicked.bind(this)}>
          <i className="glyphicon glyphicon-trash" />
          Delete
        </Button>
      </div>
    );

    const result = (
      <div>
        <Buttons />
        <ModifiedBootstrapTable
          ref="table"
          data={tableData}
          height={330}
          hover
          condensed
          pagination
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
