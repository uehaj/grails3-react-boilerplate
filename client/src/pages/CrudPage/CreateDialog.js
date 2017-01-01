import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../../components/ModalForm';
import SchemaLinks from './SchemaLinks';

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
          {
            this.props.crudConfig.SHOW_SCHEMA_LINKS &&
              <SchemaLinks schema={schema} uiSchema={uiSchema} />
          }
          &nbsp;
          <Button bsStyle="primary" type="submit">Create</Button>
          &nbsp;
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
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
