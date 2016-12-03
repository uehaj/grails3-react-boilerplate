import React, { Component, PropTypes } from 'react';
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
      book: null,
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.selectedBookId) {
      const resp = await api.getBook(nextProps.selectedBookId);
      const json = await resp.json();
      this.setState({ book: json });
    }
  }

  callbackSubmitButtonAction() {
    if (this.props.selectedBookId) {
      this.props.submitButtonAction({
        id: this.props.selectedBookId,
        // eslint-disable-next-line
        title: ReactDOM.findDOMNode(this.refs.title).value,
        // eslint-disable-next-line
        price: ReactDOM.findDOMNode(this.refs.price).value,
      });
    }
  }

  render() {
    const title = `Edit Book: ${this.state.book && this.state.book.title}`;

    const additionalButton = (
      <span>
        <Button bsStyle="primary" onClick={this.callbackSubmitButtonAction.bind(this)}>
          Update
        </Button>
      </span>);

    return (
      <ModalDialog
        title={title}
        show={this.props.show}
        close={this.props.close}
        additionalButton={additionalButton}
      >
        <Form>
          <FormGroup controlId="formTitle">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              // eslint-disable-next-line
              ref="title"
              componentClass="input"
              placeholder="Title" defaultValue={this.state.book && this.state.book.title}
            />
          </FormGroup>
          <FormGroup controlId="formPrice">
            <ControlLabel>Price</ControlLabel>
            <FormControl
              // eslint-disable-next-line
              ref="price"
              componentClass="input"
              placeholder="Price" defaultValue={this.state.book && this.state.book.price}
            />
          </FormGroup>
        </Form>
      </ModalDialog>
    );
  }
}

EditDialog.propTypes = {
  show: PropTypes.string.isRequired,
  close: PropTypes.string.isRequired,
  // eslint-disable-next-line
  selectedBookId: PropTypes.number.isRequired,
  submitButtonAction: PropTypes.func.isRequired,
};
