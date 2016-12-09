import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
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
    const { tableData, onRowClicked, onCreateButtonClicked, onRefreshButtonClicked } = this.props;

    const Buttons = (props) => (
      <div style={{marginLeft: 10}}>
        <ButtonGroup>
          <Button onClick={onCreateButtonClicked}>
            <i className="glyphicon glyphicon-plus" />
            Create
          </Button>
          <Button onClick={this.handleDeleteButtonClicked.bind(this)}>
            <i className="glyphicon glyphicon-trash" />
            Delete
          </Button>
          <Button onClick={onRefreshButtonClicked}>
            <i className="glyphicon glyphicon-refresh" />
            Refresh
          </Button>
        </ButtonGroup>
      </div>
    );

    const result = (
      <div>
        <Buttons />
        <ModifiedBootstrapTable
          ref="table"
          data={tableData}
          hover
          condensed
          pagination
          selectRow={{
            mode: 'checkbox',
            bgColor: 'rgb(238, 193, 213)',
          }}
          options={{
            onRowClick: onRowClicked,
            sizePerPage: 20,
            sizePerPageList: [ 20, 30, 40 ],
          }}
        >
          <TableHeaderColumn dataField="id" dataSort isKey width="150">ID</TableHeaderColumn>
          <TableHeaderColumn dataField="title" dataSort>Title</TableHeaderColumn>
          <TableHeaderColumn dataField="price" dataSort>Price</TableHeaderColumn>
        </ModifiedBootstrapTable>
      </div>
    );
    return result;
  }
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object),
  onRowClicked: PropTypes.func,
  onCreateButtonClicked: PropTypes.func,
  onDeleteButtonClicked: PropTypes.func,
};
