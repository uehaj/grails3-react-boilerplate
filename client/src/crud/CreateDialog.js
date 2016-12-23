import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';

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
    const required = this.props.schema.required.filter(name => name !== 'id');

    const schema = { ...this.props.schema, required };

    const uiSchema = {
      ...this.props.uiSchema,
      id: { 'ui:widget': 'hidden' },
    };

    return (
      <ModalForm
        show={this.props.show}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
        liveValidate
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
  schema: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.boolean,
    ])).isRequired,
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
};
