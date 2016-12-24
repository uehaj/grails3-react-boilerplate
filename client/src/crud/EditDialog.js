import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';
import AlertBox from '../components/AlertBox';

/**
 * Form for edit existing Domain class on a modal dialog.
 */
export default class EditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null,
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.selectedId) {
      const { api } = this.props;
      const resp = await api.getEntity(nextProps.selectedId);
      const json = await resp.json();
      this.setState({ formData: json });
    }
  }

  handleSubmit({ formData }) {
    if (this.props.selectedId) {
      this.props.onSubmit({
        id: this.props.selectedId,
        ...formData,
      });
    }
  }

  handleViewSchema(json, title) {
    AlertBox.viewJson({ json, title });
  }

  render() {

    const schema = this.props.schema;

    const uiSchema = {
      ...this.props.uiSchema,
      id: { 'ui:widget': 'hidden' },
    };

    return (
      <ModalForm
        show={this.props.show}
        formData={this.state.formData}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
      >
        <span>
          <Button onClick={this.handleViewSchema.bind(this, schema, "JSON Schema")} bsStyle="link" style={{ opacity: 0.2 }}>schema</Button>
          <Button onClick={this.handleViewSchema.bind(this, uiSchema, "UI Schema")} bsStyle="link" style={{ opacity: 0.2 }}>uiSchema</Button>
          <Button bsStyle="primary" type="submit">Update</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </span>
      </ModalForm>
    );
  }
}

EditDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  selectedId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  schema: PropTypes.shape({}),
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  api: PropTypes.objectOf(PropTypes.func).isRequired,
};
