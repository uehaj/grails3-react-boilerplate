import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FormControl, Form, ControlLabel, FormGroup } from 'react-bootstrap';
import 'react-bootstrap-table/css/react-bootstrap-table.css';

import ModalDialog from '../ModalDialog';
import * as api from '../../util/api';

/**
 * Show Domain class on a modal dialog.
 */
export default class ShowDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      book: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedBookId) {
      api.getBook(nextProps.selectedBookId).then(data => {
        console.log(data);
        this.setState({ book: data });
      });
    }
  }

  render() {
    return (
      <ModalDialog
        title={'Show Book: ' + (this.state.book ? this.state.book.title : 'loading..')}
        show={this.props.show}
        close={this.props.close}
        additionalButton={<span><Button bsStyle="primary" onClick={this.props.editButtonAction}>Edit</Button></span>}>
        <Form>
          <FormGroup controlId="formTitle">
            <ControlLabel>Title</ControlLabel>
            <FormControl.Static>{this.state.book ? this.state.book.title : 'loading..'}</FormControl.Static>
          </FormGroup>
          <FormGroup controlId="formPrice">
            <ControlLabel>Price</ControlLabel>
            <FormControl.Static>{this.state.book ? this.state.book.price : 'loading..'}</FormControl.Static>
          </FormGroup>
        </Form>
      </ModalDialog>
    );
  }
}
