import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import {modalify} from 'react-modalify';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import CreateDialog from './CreateDialog';
import ShowDialog from './ShowDialog';
import EditDialog from './EditDialog';
import ModalDialog from '../ModalDialog';
import AlertBox from '../AlertBox';
import Table from '../Table';
import * as api from '../../util/api';

/**
 * List Domain class instances.
 */
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: [],
      selectedId: null,
      createDialogVisible: false,
      showDialogVisible: false,
      editDialogVisible: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.reloadData();
  }

  async reloadData() {
    try {
      const resp = await api.getBooks();
      const json = await resp.json();
      this.setState({ bookList: json });
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

  async createBook(creatingBook) {
    this.setState({ createDialogVisible: false });
    try {
      const resp= await api.createBook(creatingBook);
      const json = await resp.json();
      this.reloadData();
      const result = await AlertBox.askYesNo({
        title: "Created",
        body: `Created ${json.id}`,
        yes: "Ok",
      });
    }
    catch(err) {
      AlertBox.error(err);
    }
  }

  async updateBook(updatedBook) {
    this.setState({ editDialogVisible: false });

    function isSelectedBook(book) {
      if (book.id === this.state.selectedId) {
        return { id: this.state.selectedId, ...updatedBook };
      }
      return book;
    }

    try {
      await api.updateBook(updatedBook);
      // Locally update data.
      this.setState({
        bookList: this.state.bookList.map(isSelectedBook.bind(this)),
      });
    }
    catch(err) {
      AlertBox.error(err);
    }
  }

  async handleDeleteButtonClicked(rowKeys) {
    try {
      const result = await AlertBox.askYesNo({
        title: "Delete",
        body: `Delete? ${rowKeys.join(',')}`,
        yes: "Delete",
        no: "Cancel",
      });
      if (result === "Delete") {
        for (const bookId of rowKeys) {
          await api.deleteBook(bookId);
          this.reloadData();
        }
      }
    }
    catch (err) {
      AlertBox.error(err);
    }
  }

  render() {

    return (
      <div>
        <h1>Books</h1>
        <Table
          tableData={this.state.bookList}
          onRowClicked={this.handleRowClicked.bind(this)}
          onCreateButtonClicked={()=>this.setState({ createDialogVisible: true })}
          onDeleteButtonClicked={this.handleDeleteButtonClicked.bind(this)}
        />
        <CreateDialog
          show={this.state.createDialogVisible}
          onClose={() => this.setState({ createDialogVisible: false })}
          onSubmit={this.createBook.bind(this)}
        />
        <ShowDialog
          show={this.state.showDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ showDialogVisible: false })}
          onEditButtonClicked={this.showEditDialog.bind(this)}
        />
        <EditDialog
          show={this.state.editDialogVisible}
          selectedId={this.state.selectedId}
          onClose={() => this.setState({ editDialogVisible: false })}
          onSubmit={this.updateBook.bind(this)}
        />
      </div>
    );
  }
}
