import React, { Component, PropTypes } from 'react';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

import AlertBox from '../components/AlertBox';
import Table from '../components/Table';
import CreateDialog from './CreateDialog';
import ShowDialog from './ShowDialog';
import EditDialog from './EditDialog';

/**
 * List Domain class instances.
 */
export default class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      entityList: [],
      selectedId: null,
      createDialogVisible: false,
      showDialogVisible: false,
      editDialogVisible: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.ignoreLastFetch = false;
    this.reloadData();
  }

  componentDidUpdate(prevProps) {
    // see https://github.com/ReactTraining/react-router/blob/master/docs/guides/ComponentLifecycle.md#fetching-data
    const prev = prevProps.api;
    const curr = this.props.api;
    if (prev !== curr) {
      this.reloadData();
    }
  }

  componentWillUnmount() {
    // allows us to ignore an inflight request in scenario 4
    this.ignoreLastFetch = true;
  }

  async reloadData() {
    const { api } = this.props;
    try {
      const resp = await api.getEntities();
      const json = await resp.json();
      if (!this.ignoreLastFetch) {
        this.setState({ entityList: json });
      }
    } catch (err) {
      const json = await err.json();
      if (json.error !== 404) {
        AlertBox.error("Error:"+json.message);
      }
      this.setState({ entityList: [] });
    }
  }

  handleRowClicked(row) {
    this.setState({
      selectedId: row.id,
      showDialogVisible: true,
    });
  }

  showEditDialog() {
    this.setState({
      editDialogVisible: true,
      showDialogVisible: false,
    });
  }

  async createEntity(creatingEntity) {
    this.setState({ createDialogVisible: false });
    const { api } = this.props;

    try {
      const resp = await api.createEntity(creatingEntity);
      const json = await resp.json();
      this.reloadData();
      await AlertBox.askYesNo({
        title: 'Created',
        body: `Created ${json.id}`,
        yes: 'Ok',
      });
    } catch (err) {
      AlertBox.error(err);
    }
  }

  async updateEntity(updatedEntity) {
    this.setState({ editDialogVisible: false });

    function isSelectedEntity(entity) {
      if (entity.id === this.state.selectedId) {
        return { id: this.state.selectedId, ...updatedEntity };
      }
      return entity;
    }

    const { api } = this.props;
    try {
      await api.updateEntity(updatedEntity);
      // Locally update data.
      this.setState({
        entityList: this.state.entityList.map(isSelectedEntity.bind(this)),
      });
    } catch (err) {
      AlertBox.error(err);
    }
  }

  async handleDeleteButtonClicked(rowKeys) {
    if (rowKeys.length === 0) {
      AlertBox.askYesNo({
        title: <span><i className="glyphicon glyphicon-info-sign" />Delete</span>,
        body: 'Select at least one checkbox to delete.',
        yes: 'Ok',
      });
      return;
    }

    const { api } = this.props;

    try {
      const result = await AlertBox.askYesNo({
        title: 'Delete',
        body: `Delete? ${rowKeys.join(',')}`,
        yes: 'Delete',
        no: 'Cancel',
      });
      if (result === 'Delete') {
        rowKeys.forEach(async (entityId) => {
          await api.deleteEntity(entityId);
          this.reloadData();
        });
      }
    } catch (err) {
      AlertBox.error(err);
    }
  }

  async handleRefreshButtonClicked() {
    this.reloadData();
  }

  render() {
    const { api, schema } = this.props;
    const { title } = schema;
    console.log('1>>>>>>>>>>>>>>>>>>>>>---------',this.state.entityList);

    return (
      <div>
        <h1>{title}</h1>
        <Table
          tableData={this.state.entityList}
          onRowClicked={this.handleRowClicked.bind(this)}
          onCreateButtonClicked={() => this.setState({ createDialogVisible: true })}
          onDeleteButtonClicked={this.handleDeleteButtonClicked.bind(this)}
          onRefreshButtonClicked={this.handleRefreshButtonClicked.bind(this)}
          schema={schema}
          api={api}
        />
        <CreateDialog
          show={this.state.createDialogVisible}
          onClose={() => this.setState({ createDialogVisible: false })}
          onSubmit={this.createEntity.bind(this)}
          schema={{ title: `Create ${title}`, ...schema }}
          api={api}
        />
        <ShowDialog
          show={this.state.showDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ showDialogVisible: false })}
          onEditButtonClicked={this.showEditDialog.bind(this)}
          schema={schema}
          api={api}
        />
        <EditDialog
          show={this.state.editDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ editDialogVisible: false })}
          onSubmit={this.updateEntity.bind(this)}
          schema={{ title: `Edit ${title}`, ...schema }}
          api={api}
        />
      </div>
    );
  }
}


List.propTypes = {
  schema: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.boolean])).isRequired,
  api: PropTypes.objectOf(PropTypes.func).isRequired,
};
