import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../../components/ModalForm';
import SchemaLinks from './SchemaLinks';
import ManyToOneField from '../../forms/ManyToOneField';
import OneToManyField from '../../forms/OneToManyField';
import AssociationSelect from '../../forms/AssociationSelect';
import AssociationMultiSelect from '../../forms/AssociationMultiSelect';
import api from '../../util/api';

function bindAdditionalProps(crudConfig, AssocComponent, Field) {
  return (props) => {
    const additionalProps = { crudConfig, AssocComponent };
    return <Field {...additionalProps} {...props} />;
  };
}

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
      const restApi = api.createRestApi(this.props.crudConfig.SERVER_URL, this.props.domainClass);
      const resp = await restApi.getEntity(nextProps.selectedId);
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

  render() {
    const { schema: origSchema, uiSchema: origUiSchema, selectedId, crudConfig, show, onClose } = this.props;

    const schema = {
      ...origSchema,
      title: `${origSchema.title}:${selectedId}`,
    };

    const hiddenFields = crudConfig.HIDDEN_FORM_FIELDS
          .reduce((accum, elem) => ({ [elem]: { 'ui:widget': 'hidden' }, ...accum }), {});

    const uiSchema = {
      ...origUiSchema,
      ...hiddenFields,
    };

    const fields = {
      manyToOne: bindAdditionalProps(crudConfig, AssociationSelect, ManyToOneField),
      oneToMany: bindAdditionalProps(crudConfig, AssociationMultiSelect, OneToManyField),
    };

    return (
      <ModalForm
        show={show}
        formData={this.state.formData}
        onClose={onClose}
        schema={schema}
        uiSchema={uiSchema}
        liveValidate
        fields={fields}
        onSubmit={this.handleSubmit.bind(this)}
      >
        <span>
          {
            crudConfig.SHOW_SCHEMA_LINKS &&
              <SchemaLinks schema={schema} uiSchema={uiSchema} />
          }
          <Button bsStyle="primary" type="submit">Update</Button>
          &nbsp;
          <Button onClick={onClose}>Cancel</Button>
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
  schema: PropTypes.shape({ title: PropTypes.string }),
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  domainClass: PropTypes.string.isRequired,
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
