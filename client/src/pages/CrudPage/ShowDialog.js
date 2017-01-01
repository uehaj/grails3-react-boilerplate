import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../../components/ModalForm';
import SchemaLinks from './SchemaLinks';

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
  makeStatic() {
    const { schema, crudConfig } = this.props;

    const StaticText = props => <div>{props.value}</div>;

    const RelationValueText = (key, props) => {
      console.log('key=',key,' props=',props);
      const ids = props.schema;
      if (ids.properties[key].associationType === 'many-to-many' ||
          ids.properties[key].associationType === 'one-to-one') {
        const index = ids.enum.findIndex(elem => elem === props.value);
        return <div>{ids.enumNames[index]}</div>;
      } else if (ids.properties[key].associationType === 'one-to-many') {
        console.log(key);
      }
      return props;
    };

    return Object.keys(schema.properties)
      .filter(k => crudConfig.HIDDEN_FORM_FIELDS.indexOf(k) === -1)
      .reduce(
        (map, key) => {
          if (schema.properties[key].associationType) {
            console.log(schema.properties[key].associationType);
            return {
              ...map,
              [key]: {
//                'ui:widget': StaticText,
                'ui:widget': RelationValueText.bind(this, key),
                id: {
                  'ui:widget': RelationValueText.bind(this, key),
                },
              },
            };
          }
          return { ...map, [key]: { 'ui:widget': StaticText } };
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
      ...this.makeStatic(),
      ...this.props.uiSchema,
      ...hiddenFields,
    };

    return (
      <ModalForm
        show={this.props.show}
        formData={this.state.formData}
        onClose={this.props.onClose}
        schema={schema}
        uiSchema={uiSchema}
        liveValidate
      >
        <span>
          {
            this.props.crudConfig.SHOW_SCHEMA_LINKS &&
              <SchemaLinks schema={schema} uiSchema={uiSchema} />
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
