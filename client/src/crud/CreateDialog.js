import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';
import AlertBox from '../components/AlertBox';

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

  handleViewSchema(json, title) {
    AlertBox.viewJson({ json, title });
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
          <Button onClick={this.handleViewSchema.bind(this, schema, "JSON Schema")} bsStyle="link" style={{ opacity: 0.2 }}>schema</Button>
          <Button onClick={this.handleViewSchema.bind(this, uiSchema, "UI Schema")} bsStyle="link" style={{ opacity: 0.2 }}>uiSchema</Button>
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
  schema: PropTypes.shape({}).isRequired,
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
};
