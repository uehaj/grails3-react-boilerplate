import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import ModalDialog from './ModalDialog';

/**
 * Form for create Book Domain class on a modal dialog.
 */
export default class BookNewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: null
    };
  }

  callbackSubmitButtonAction() {
    this.props.submitButtonAction({
      title: ReactDOM.findDOMNode(this.refs.title).value,
      price: ReactDOM.findDOMNode(this.refs.price).value
    });
  }

  render() {
    return (
      <ModalDialog title="New Book"
                   show={this.props.show}
                   close={this.props.close}
                   additionalButton={<Button bsStyle="primary" onClick={this.callbackSubmitButtonAction.bind(this)}>Create</Button>}>
        <Form>
          <FormGroup controlId="formTitle">
            <ControlLabel>Title</ControlLabel>
            <FormControl ref='title'
              componentClass='input'
              placeholder="Title" defaultValue={this.state.book && this.state.book.title} />
          </FormGroup>
          <FormGroup controlId="formHorizontalPrice">
              <ControlLabel>Price</ControlLabel>
              <FormControl ref='price'
                componentClass='input'
                placeholder="Price" defaultValue={this.state.book && this.state.book.price} />
          </FormGroup>
        </Form>
      </ModalDialog>
    );
  }
}
