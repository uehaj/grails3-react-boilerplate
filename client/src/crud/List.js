import React, { Component } from 'react';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import AlertBox from '../components/AlertBox';
import Table from '../components/Table';
import * as api from '../util/api';
import _CreateDialog from './CreateDialog';
import _ShowDialog from './ShowDialog';
import _EditDialog from './EditDialog';
import crudFor from './crudFor';

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

    this.CreateDialog = crudFor(_CreateDialog, "book", {title: 'Create book', ...this.props.schema});
    this.ShowDialog = crudFor(_ShowDialog, "book", {title: 'Show book', ...this.props.schema});
    this.EditDialog = crudFor(_EditDialog, "book", {title: 'Edit book', ...this.props.schema});
  }

  componentDidMount() {
    this.reloadData();
  }

  async reloadData() {
    try {
      const resp = await api.getBooks();
      const json = await resp.json();
      this.setState({ entityList: json });
    }
    catch (err) {
      AlertBox.error(err);
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
    try {
      const resp= await api.createBook(creatingEntity);
      const json = await resp.json();
      this.reloadData();
      await AlertBox.askYesNo({
        title: "Created",
        body: `Created ${json.id}`,
        yes: "Ok",
      });
    }
    catch(err) {
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

    try {
      await api.updateBook(updatedEntity);
      // Locally update data.
      this.setState({
        entityList: this.state.entityList.map(isSelectedEntity.bind(this)),
      });
    }
    catch(err) {
      AlertBox.error(err);
    }
  }

  async handleDeleteButtonClicked(rowKeys) {
    if (rowKeys.length === 0) {
      AlertBox.askYesNo({
        title: <span><i className="glyphicon glyphicon-info-sign" />Delete</span>,
        body: `Select checkboxes to delete.`,
        yes: "Ok",
      });
      return;
    }
    try {
      const result = await AlertBox.askYesNo({
        title: "Delete",
        body: `Delete? ${rowKeys.join(',')}`,
        yes: "Delete",
        no: "Cancel",
      });
      if (result === "Delete") {
        for (const entityId of rowKeys) {
          await api.deleteBook(entityId);
          this.reloadData();
        }
      }
    }
    catch (err) {
      AlertBox.error(err);
    }
  }

  render() {
    const CreateDialog = this.props.CreateDialog;
    const ShowDialog = this.props.ShowDialog;
    const EditDialog = this.props.EditDialog;

    return (
      <div>
        <h1>Books</h1>
        <Table
          tableData={this.state.entityList}
          onRowClicked={this.handleRowClicked.bind(this)}
          onCreateButtonClicked={()=>this.setState({ createDialogVisible: true })}
          onDeleteButtonClicked={this.handleDeleteButtonClicked.bind(this)}
        />
        <this.CreateDialog
          show={this.state.createDialogVisible}
          onClose={() => this.setState({ createDialogVisible: false })}
          onSubmit={this.createEntity.bind(this)}
        />
        <this.ShowDialog
          show={this.state.showDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ showDialogVisible: false })}
          onEditButtonClicked={this.showEditDialog.bind(this)}
        />
        <this.EditDialog
          show={this.state.editDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ editDialogVisible: false })}
          onSubmit={this.updateEntity.bind(this)}
        />
      </div>
    );
  }
}
