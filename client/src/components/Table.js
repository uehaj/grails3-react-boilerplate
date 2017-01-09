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

  static resolveRelationValue(schema, name, cellValue) {
    if (schema.properties[name].associationType === 'many-to-one' ||
        schema.properties[name].associationType === 'one-to-one') {
      const ids = schema.properties[name].properties.id;
      const index = ids.enum.findIndex(elem => elem === cellValue.id);
      return ids.enumNames[index];
    } else if (schema.properties[name].associationType === 'one-to-many') {
      return cellValue.map(elem => elem.id).join(',');
    }
    return cellValue;
  }

  handleDeleteButtonClicked() {
    // eslint-disable-next-line
    this.refs.table.deleteSelected(
      ids => this.props.onDeleteButtonClicked(ids), // call delete API
    );
  }

  cleanSelected() {
    // eslint-disable-next-line
    this.refs.table.cleanSelected();
  }


  render() {
    const { tableData, onRowClicked, onCreateButtonClicked,
            onRefreshButtonClicked, schema, crudConfig } = this.props;

    const Buttons = (
      <div style={{ marginLeft: 10 }}>
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

    const headerProperties = (scm) => {
      const result = Object.entries(scm.properties)
      // eslint-disable-next-line
            .filter(([k, _]) => crudConfig.HIDDEN_TABLE_FIELDS.indexOf(k) === -1)
            .reduce((acc, [kk, vv]) => ({ ...acc, [kk]: vv }), {});
      return result;
    };

    const dataFormatter = (cell, row, name) => {
      if (typeof cell === 'object') {
        return Table.resolveRelationValue(schema, name, cell);
      }
      return cell;
    };

    const Header = (
      Object.keys(headerProperties(schema)).map(
        key => (
          <TableHeaderColumn
            dataField={key}
            dataSort
            isKey={key === 'id'}
            {... ((key === 'id') ? { width: '50%' } : {})}
            key={key}
            dataFormat={dataFormatter}
            formatExtraData={key}
          >
            {key}
          </TableHeaderColumn>))
    );

    return (
      <div>
        {Buttons}
        <ModifiedBootstrapTable
          // eslint-disable-next-line
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
            sizePerPageList: [20, 30, 40],
          }}
        >
          {Header}
        </ModifiedBootstrapTable>
      </div>
    );
  }
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.object),
  onRowClicked: PropTypes.func,
  onCreateButtonClicked: PropTypes.func,
  onDeleteButtonClicked: PropTypes.func,
  onRefreshButtonClicked: PropTypes.func,
  schema: PropTypes.shape({
    properties: PropTypes.object,
  }).isRequired,
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
