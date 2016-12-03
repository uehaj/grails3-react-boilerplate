import React, { Component, PropTypes } from 'react';
import { Button, FormControl, Form, ControlLabel, FormGroup } from 'react-bootstrap';
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
      book: null,
    };
  }

  async componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.selectedBookId) {
      const resp = await api.getBook(nextProps.selectedBookId);
      const json = await resp.json();
      this.setState({ book: json });
    }
  }

  render() {
    const title = `Show Book: ${this.state.book ? this.state.book.title : 'loading..'}`;

    const additionalButton = (
      <span>
        <Button bsStyle="primary" onClick={this.props.editButtonAction}>Edit</Button>
      </span>
    );

    return (
      <ModalDialog
        title={title}
        show={this.props.show}
        onClose={this.props.onClose}
        additionalButton={additionalButton}
      >
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

ShowDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBookId: PropTypes.number,
  editButtonAction: PropTypes.func.isRequired,
};
