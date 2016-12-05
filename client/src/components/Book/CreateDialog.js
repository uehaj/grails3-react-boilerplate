import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from './ModalForm';

/**
 * Form for create Domain class on a modal dialog.
 */
export default class CreateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null,
    };
  }

  handleSubmit({ formData }) {
    this.props.onSubmit(formData);
  }

  render() {
    const schema = {
      title: 'Create Book',
      type: 'object',
      required: ['title', 'price'],
      properties: {
        title: { type: 'string', title: 'Title', default: 'no title' },
        price: { type: 'number', title: 'Price', default: 0 },
      },
    };

    const uiSchema = {
    };

    return (
      <ModalForm
        show={this.props.show}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
      >
        <span>
          <Button bsStyle="primary" type="submit">Create</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </span>
      </ModalForm>
    );
  }
}

CreateDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
