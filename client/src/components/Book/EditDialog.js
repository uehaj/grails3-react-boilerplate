import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'react-bootstrap';
import Form from "react-jsonschema-form";
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

    const schema = {
      title: "Book",
      type: "object",
      required: ["title", "price"],
      properties: {
        title: {type: "string", title: "Title", default: "no title"},
        price: {type: "number", title: "Price", default: 0},
      },
    };

    const CustomTitleField = ({title, required}) => {
      const legend = required ? title + '*' : title;
      return <div id="custom">{legend}</div>;
    };

    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Body>
        <Form schema={schema}>
        </Form>
        </Modal.Body>
      </Modal>
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
