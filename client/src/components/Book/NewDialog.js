import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import ModalDialog from '../ModalDialog';

/**
 * Form for create Domain class on a modal dialog.
 */
export default class NewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: null,
    };
  }

  handleSubmit() {
    this.props.onSubmit({
      // eslint-disable-next-line
      title: ReactDOM.findDOMNode(this.refs.title).value,
      // eslint-disable-next-line
      price: ReactDOM.findDOMNode(this.refs.price).value,
    });
  }

  render() {
    const additionalButton = (
      <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>Create</Button>
    );

    return (
      <ModalDialog
        show={this.props.show}
        title="New Book"
        onClose={this.props.onClose}
        additionalButton={additionalButton}
      >
        <Form>
          <FormGroup controlId="formTitle">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              // eslint-disable-next-line
              ref="title"
              componentClass="input"
              placeholder="Title"
              defaultValue={this.state.book && this.state.book.title}
            />
          </FormGroup>
          <FormGroup controlId="formHorizontalPrice">
            <ControlLabel>Price</ControlLabel>
            <FormControl
              // eslint-disable-next-line
              ref="price"
              componentClass="input"
              placeholder="Price"
              defaultValue={this.state.book && this.state.book.price}
            />
          </FormGroup>
        </Form>
      </ModalDialog>
    );
  }
}

NewDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};