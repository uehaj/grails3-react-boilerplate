import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../../components/ModalForm';
import SchemaLinks from './SchemaLinks';
import OneToMany from '../../forms/OneToMany';

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

  async componentWillReceiveProps(nextProps) {
    if (nextProps.selectedId) {
      const { api } = this.props;
      const resp = await api.getEntity(nextProps.selectedId);
      const json = await resp.json();
      this.setState({ formData: json });
    }
  }

  handleDeleteButtonClicked() {
    this.props.onDeleteButtonClicked([this.props.selectedId]);
    this.props.onClose();
  }


  /* replace input tag to normal text */
  /*
  makeStatic() {
    const ManyToOneRelationValueText = (scm, props) => {
      const index = scm.enum.findIndex(elem => elem === props.value);
      return <div>{scm.enumNames[index]}</div>;
    };

    const OneToManyRelationValueText = (key, props) => {
      return <div>hoge</div>;
    };

    const excludesHidden = k => crudConfig.HIDDEN_FORM_FIELDS.indexOf(k) === -1;

    return Object.keys(schema.properties)
      .filter(excludesHidden)
      .reduce(
        (map, key) => {
          if (schema.properties[key].associationType) {
            return {
              ...map,
              [key]: {
                id: {
                  'ui:widget': OneToManyRelationValueText.bind(this, schema),
                },
              },
            };
          }
//          return { ...map, [key]: { 'ui:widget': StaticText } };
        },
        {});
  }
  */

  makeReadOnly() {
    const { schema, crudConfig } = this.props;

    const excludesHidden = k => crudConfig.HIDDEN_FORM_FIELDS.indexOf(k) === -1;

    return Object.keys(schema.properties)
      .filter(excludesHidden)
      .reduce(
        (map, key) => {
          return { ...map, [key]: { 'ui:readonly': true } };
        },
        {});
  }

  render() {
    const schema = {
      ...this.props.schema,
      title: `${this.props.schema.title}:${this.props.selectedId}`,
    };

    const hiddenFields = this.props.crudConfig.HIDDEN_FORM_FIELDS
          .reduce((accum, elem) => ({ [elem]: { 'ui:widget': 'hidden' }, ...accum }), {});

    const uiSchema = {
      ...this.makeReadOnly(),
      ...this.props.uiSchema,
      ...hiddenFields,
    };

    const fields = {
      oneToMany: OneToMany.bind(null, this.props.crudConfig),
    };

    const StaticWidget = (props) => {
      return <p className="form-control-static">{props.value}</p>;
    };

    const StaticPasswordWidget = (props) => {
      return <p className="form-control-static">{props.value.replace(/./g, '*')}</p>;
    };

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
        show={this.props.show}
        formData={this.state.formData}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        liveValidate
        fields={fields}
        widgets={widgets}
      >
        <span>
          {
            this.props.crudConfig.SHOW_SCHEMA_LINKS &&
              <SchemaLinks schema={schema} uiSchema={uiSchema} formData={this.state.formData} dialogClose={this.props.onClose}/>
          }
          <Button bsStyle="danger" onClick={this.handleDeleteButtonClicked.bind(this)}>
            <i className="glyphicon glyphicon-trash" />Delete</Button>
          &nbsp;
          <Button bsStyle="primary" onClick={this.props.onEditButtonClicked}>
            <i className="glyphicon glyphicon-pencil" />Edit</Button>
          &nbsp;
          <Button onClick={this.props.onClose}>Close</Button>
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
  api: PropTypes.objectOf(PropTypes.func).isRequired,
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
