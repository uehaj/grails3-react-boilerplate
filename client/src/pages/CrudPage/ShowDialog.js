import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../../components/ModalForm';
import SchemaLinks from './SchemaLinks';
import ManyToOneField from '../../forms/ManyToOneField';
import OneToManyField from '../../forms/OneToManyField';
import AssociationLink from '../../forms/AssociationLink';
import AssociationLinks from '../../forms/AssociationLinks';
import api from '../../util/api';

function bindAdditionalProps(crudConfig, AssocComponent, Field) {
  return (props) => {
    const additionalProps = { crudConfig, AssocComponent };
    return <Field {...additionalProps} {...props} />;
  };
}

/**
 * Show Domain class on a modal dialog.
 */
export default class ShowDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedId
        || (this.props.show === false && nextProps.show === true)) {
      this.reloadData(nextProps);
    }
  }

  async reloadData(nextProps) {
    const restApi = api.createRestApi(this.props.crudConfig.SERVER_URL, this.props.domainClass);
    const resp = await restApi.getEntity(nextProps.selectedId);
    const json = await resp.json();
    this.setState({ formData: json });
  }

  handleDeleteButtonClicked() {
    this.props.onDeleteButtonClicked([this.props.selectedId]);
    this.props.onClose();
  }

  makeUiReadonly() {
    const { schema, crudConfig } = this.props;

    const excludesHidden = k => crudConfig.HIDDEN_FORM_FIELDS.indexOf(k) === -1;

    return Object.keys(schema.properties)
      .filter(excludesHidden)
      .reduce(
        (map, key) => ({ ...map, [key]: { 'ui:readonly': true } }),
        {});
  }

  render() {
    if (this.state.formData == null) {
      return null;
    }

    const { schema: origSchema, uiSchema: origUiSchema, selectedId, crudConfig, show, onClose,
            onEditButtonClicked } = this.props;

    const schema = {
      ...origSchema,
      title: `${origSchema.title}:${selectedId}`,
    };

    const hiddenFields = crudConfig.HIDDEN_FORM_FIELDS
          .reduce((accum, elem) => ({ [elem]: { 'ui:widget': 'hidden' }, ...accum }), {});

    const uiSchema = {
      ...this.makeUiReadonly(),
      ...origUiSchema,
      ...hiddenFields,
    };

    const fields = {
      manyToOne: bindAdditionalProps(crudConfig, AssociationLink, ManyToOneField),
      oneToMany: bindAdditionalProps(crudConfig, AssociationLinks, OneToManyField),
    };

    const StaticWidget = props =>
      <p className="form-control-static">{props.value}</p>;

    const StaticPasswordWidget = props =>
      <p className="form-control-static">{props.value.replace(/./g, '*')}</p>;

    const DisabledCheckboxWidget = (props) => {
      const checked = !!props.value;
      return (
        <p>
          <input type="checkbox" id="checkon" disabled checked={checked} />
          <label htmlFor="checkon">{props.label}</label>
        </p>);
    };

    const widgets = {
      PasswordWidget: StaticPasswordWidget,
      RadioWidget: StaticWidget, // TODO: Change
      UpDownWidget: StaticWidget,
      RangeWidget: StaticWidget,
      SelectWidget: StaticWidget,
      TextWidget: StaticWidget,
      DateWidget: StaticWidget,
      DateTimeWidget: StaticWidget,
      AltDateWidget: StaticWidget,
      AltDateTimeWidget: StaticWidget,
      EmailWidget: StaticWidget,
      URLWidget: StaticWidget,
      TextareaWidget: StaticWidget,
      ColorWidget: StaticWidget, // TODO: Change
      FileWidget: StaticWidget, // TODO: Change
      CheckboxWidget: DisabledCheckboxWidget,
      CheckboxesWidget: StaticWidget, // TODO: Change
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
        widgets={widgets}
      >
        <span>
          {
            crudConfig.SHOW_SCHEMA_LINKS &&
              <SchemaLinks
                schema={schema}
                uiSchema={uiSchema}
                formData={this.state.formData}
                dialogClose={onClose}
              />
          }
          <Button bsStyle="danger" onClick={this.handleDeleteButtonClicked.bind(this)}>
            <i className="glyphicon glyphicon-trash" />Delete</Button>
          &nbsp;
          <Button bsStyle="primary" onClick={onEditButtonClicked}>
            <i className="glyphicon glyphicon-pencil" />Edit</Button>
          &nbsp;
          <Button onClick={onClose}>Close</Button>
        </span>
      </ModalForm>
    );
  }
}

ShowDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  selectedId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onEditButtonClicked: PropTypes.func.isRequired,
  onDeleteButtonClicked: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    properties: PropTypes.object,
  }),
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  domainClass: PropTypes.string.isRequired,
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
