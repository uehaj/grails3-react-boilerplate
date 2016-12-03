import React, { Component, PropTypes } from 'react';
import ModalForm from './ModalForm';
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

  handleSubmit({formData}) {
    console.log('handleSubmit({formData})')
    if (this.props.selectedBookId) {
      this.props.onSubmit({
        id: this.props.selectedBookId,
        ...formData
      });
    }
  }

  render() {
    const schema = {
      title: "Book",
      type: "object",
      required: ["title", "price"],
      properties: {
        title: {type: "string", title: "Title", default: "no title"},
        price: {type: "number", title: "Price", default: 0},
      },
    };

    const uiSchema = {
    };

    return (
      <ModalForm
        show={this.props.show}
        formData={this.state.book}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
      />
    );
  }
}

EditDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  selectedBookId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
