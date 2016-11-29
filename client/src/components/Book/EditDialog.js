import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import ModalDialog from '../ModalDialog';
import * as api from '../../util/api';

/**
 * Form for edit existing Domain class on a modal dialog.
 */
export default class EditDialog extends Component {
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

  callbackSubmitButtonAction() {
    this.props.submitButtonAction({
      title: ReactDOM.findDOMNode(this.refs.title).value,
      price: ReactDOM.findDOMNode(this.refs.price).value
    });
  }

  render() {
    return (
      <ModalDialog
        title={'Edit Book: ' + (this.state.book && this.state.book.title)}
        show={this.props.show}
        close={this.props.close}
        additionalButton={<span><Button bsStyle="primary" onClick={this.callbackSubmitButtonAction.bind(this)}>Update</Button></span>}>
        <Form>
          <FormGroup controlId="formTitle">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              ref='title'
              componentClass='input'
              placeholder="Title" defaultValue={this.state.book && this.state.book.title} />
          </FormGroup>
          <FormGroup controlId="formPrice">
            <ControlLabel>Price</ControlLabel>
            <FormControl
              ref='price'
              componentClass='input'
              placeholder="Price" defaultValue={this.state.book && this.state.book.price} />
          </FormGroup>
        </Form>
      </ModalDialog>
    );
  }
}
