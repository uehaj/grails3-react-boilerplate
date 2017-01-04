import React, { Component, PropTypes } from 'react';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

import AlertBox from '../../components/AlertBox';
import Table from '../../components/Table';
import CreateDialog from './CreateDialog';
import ShowDialog from './ShowDialog';
import EditDialog from './EditDialog';
import loadingIcon from '../../images/loading.svg';
import SchemaLinks from './SchemaLinks';

/**
 * List Domain class instances.
 */
export default class List extends Component {

  constructor(props) {
    super(props);

    this.state = {
      entityList: [],
      selectedId: props.selectedId,
      createDialogVisible: false,
      showDialogVisible: props.selectedId !== undefined,
      editDialogVisible: false,
      errorMessage: '',
      loading: false,
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
    // allows us to ignore an inflight request after umounted.
    this.ignoreLastFetch = true;
  }

  async reloadData() {
    const { api, crudConfig } = this.props;
    try {
      const max = crudConfig.MAX_TABLEDATA_SIZE;
      const resp = await api.getEntities(max);
      const json = await resp.json();
      if (!this.ignoreLastFetch) {
        this.setState({ entityList: json });
      }
    } catch (err) {
      this.setState({ entityList: [] });
      const json = await err.json();
      AlertBox.error(`Error: ${json.message}`);
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
      const json = await err.json();
      AlertBox.error(`Error: ${json.message}`);
    }
  }

  async updateEntity(updatedEntity) {
    this.setState({ editDialogVisible: false });

    function updateSelectedEntity(entity) {
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
        entityList: this.state.entityList.map(updateSelectedEntity.bind(this)),
      });
    } catch (err) {
      const json = await err.json();
      AlertBox.error(`Error: ${json.message}`);
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
          this.setState({ selectedId: null });
          this.reloadData();
        });
      }
    } catch (err) {
      const json = await err.json();
      AlertBox.error(`Error: ${json.message}`);
    }
  }

  async handleRefreshButtonClicked() {
    this.setState({ loading: true });
    try {
      await this.reloadData();
    } finally {
      this.setState({ loading: false });
    }
  }

  handleViewSchema(json, title) {
    AlertBox.viewJson({ json, title });
  }

  render() {
    const { api, schema, uiSchema } = this.props;
    const { title } = schema;

    const loadingAnimation = this.state.loading
          ? <img src={loadingIcon} className={'App-loading'} alt={'loading'} />
          : null;

    return (
      <div>
        <h1>
          {title}
          {loadingAnimation}
          {
            this.props.crudConfig.SHOW_SCHEMA_LINKS &&
              <SchemaLinks schema={schema} uiSchema={uiSchema} />
          }
        </h1>
        <Table
          tableData={this.state.entityList}
          onRowClicked={this.handleRowClicked.bind(this)}
          onCreateButtonClicked={() => this.setState({ createDialogVisible: true })}
          onDeleteButtonClicked={this.handleDeleteButtonClicked.bind(this)}
          onRefreshButtonClicked={this.handleRefreshButtonClicked.bind(this)}
          schema={schema}
          api={api}
          crudConfig={this.props.crudConfig}
        />
        <CreateDialog
          show={this.state.createDialogVisible}
          onClose={() => this.setState({ createDialogVisible: false })}
          onSubmit={this.createEntity.bind(this)}
          schema={{ title: `Create ${title}`, ...schema }}
          uiSchema={uiSchema}
          api={api}
          crudConfig={this.props.crudConfig}
        />
        <ShowDialog
          show={this.state.showDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ showDialogVisible: false })}
          onEditButtonClicked={this.showEditDialog.bind(this)}
          onDeleteButtonClicked={this.handleDeleteButtonClicked.bind(this)}
          schema={schema}
          uiSchema={uiSchema}
          api={api}
          crudConfig={this.props.crudConfig}
        />
        <EditDialog
          show={this.state.editDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ editDialogVisible: false })}
          onSubmit={this.updateEntity.bind(this)}
          schema={{ title: `Edit ${title}`, ...schema }}
          uiSchema={uiSchema}
          api={api}
          crudConfig={this.props.crudConfig}
        />
      </div>
    );
  }
}

List.propTypes = {
  schema: PropTypes.shape({}).isRequired,
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  api: PropTypes.objectOf(PropTypes.func).isRequired,
  selectedId: PropTypes.string,
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
