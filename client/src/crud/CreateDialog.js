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

    console.log("1",this.props.schema)
    /* drop id property from schema */
    //    const schemaProperties = Object.entries(this.props.schema.properties)
    //          .filter(([key,value]) => key !== 'id')
    //          .reduce((accum, [key, value])=>({...accum, [key]:value}), {});

    const required = this.props.schema.required.filter(name => name !== 'id');

    const schema = { ...this.props.schema, required };

    console.log("1",schema)
    const uiSchema = {
      id: { 'ui:widget': 'hidden' },
    };

    return (
      <ModalForm
        show={this.props.show}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
        liveValidate={true}
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
  schema: PropTypes.objectOf(PropTypes.object).isRequired,
};
