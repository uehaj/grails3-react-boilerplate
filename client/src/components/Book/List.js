import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

import NewDialog from './NewDialog';
import ShowDialog from './ShowDialog';
import EditDialog from './EditDialog';
import ModalDialog from '../ModalDialog';
import * as api from '../../util/api';

/**
 * List Domain class instances.
 */
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { bookList:[],
                   selectedBookId:null,
                   showNewDialog:false,
                   showShowDialog:false,
                   showEditDialog:false,
                   showErrorDialog:false,
                   errorMessage:''};
  }
  reloadData() {
    api.getBooks().then(data => {
      console.log(data);
      this.setState({ bookList: data });
    });
  }
  componentDidMount() {
    api.getBooks().then(data =>
      this.setState({ bookList: data })
    );
  }
  handleRowClicked(row) {
    this.setState({ selectedBookId: row.id,
                    showShowDialog: true});
  }
  showEditDialog() {
    this.setState({ showEditDialog: true,
                    showShowDialog: false});
  }

  createBook(creatingBook) {
    this.setState({showNewDialog: false});
    api.createBook(creatingBook).then(()=>{
      this.reloadData();
    }).catch(err => {
      this.setState({errorMessage: err,
                     showErrorDialog: true});
    });
  }

  updateBook(updatedBook) {
    this.setState({showEditDialog: false});
    api.updateBook(this.state.selectedBookId, updatedBook).then(() => {
      // Locally update data.
      this.setState(
        {
          bookList: this.state.bookList.map(
            (book) => (book.id === this.state.selectedBookId)
              ? {id:this.state.selectedBookId, ...updatedBook}
              : book)
        }
      );
    }).catch(err => {
      this.setState({errorMessage: err,
                     showErrorDialog: true});
    });
  }

  deleteBook(rowKeys) {
    rowKeys.forEach(bookId=>{
      api.deleteBook(bookId).then(()=>{
        this.reloadData();
      }).catch(err=>{
        this.setState({errorMessage: err,
                       showErrorDialog: true});
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Books</h1>
        <Button className="btn btn-success react-bs-table-del-btn" onClick={()=>this.setState({showNewDialog:true})}><i class="glyphicon glyphicon-plus"></i>New</Button>
        <BootstrapTable
          data={this.state.bookList}
          height={430}
          hover condensed pagination deleteRow
          selectRow={{
            mode: 'checkbox',
            bgColor: "rgb(238, 193, 213)",
          }}
          options={{
            onRowClick: this.handleRowClicked.bind(this),
            afterDeleteRow: this.deleteBook.bind(this)
          }}
          >
          <TableHeaderColumn dataField="id" dataSort={true} isKey={true} width="150">ID</TableHeaderColumn>
          <TableHeaderColumn dataField="title" dataSort={true}>Title</TableHeaderColumn>
          <TableHeaderColumn dataField="price" dataSort={true}>Price</TableHeaderColumn>
        </BootstrapTable>
        <NewDialog
          show={this.state.showNewDialog}
          close={()=>this.setState({showNewDialog:false})}
          submitButtonAction={this.createBook.bind(this)} />
        <ShowDialog
          show={this.state.showShowDialog}
          selectedBookId={this.state.selectedBookId}
          close={()=>this.setState({showShowDialog:false})}
          editButtonAction={this.showEditDialog.bind(this)}/>
        <EditDialog
          show={this.state.showEditDialog}
          selectedBookId={this.state.selectedBookId}
          close={()=>this.setState({showEditDialog:false})}
          submitButtonAction={this.updateBook.bind(this)}/>
        <ModalDialog
          title="Error"
          show={this.state.showErrorDialog}
          close={()=>this.setState({showErrorDialog:false})}>
          <div>{this.state.errorMessage}</div>
        </ModalDialog>
      </div>
    );
  }
}
