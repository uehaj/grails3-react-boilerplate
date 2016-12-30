import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';
import AlertBox from '../components/AlertBox';

/**
 * Show Domain class on a modal dialog.
 */
export default class ShowDialog extends Component {

  /* replace input tag to normal text */
  static makeStatic(schema) {
    const StaticText = props => <div>{props.value}</div>;

    return Object.keys(schema.properties)
      .filter(key => key !== 'version')
      .reduce(
        (map, key) => {
          if (schema.properties[key].type === 'object') {
            return { ...map, [key]: { 'ui:widget': StaticText, ...ShowDialog.makeStatic(schema.properties[key]) } };
          } else {
            return { ...map, [key]: { 'ui:widget': StaticText } };
          }
        },
        {});
  }

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

  // eslint-disable-next-line
  handleViewSchema(json, title) {
    AlertBox.viewJson({ json, title });
  }

  handleDeleteButtonClicked() {
    this.props.onDeleteButtonClicked([this.props.selectedId]);
    this.props.onClose();
  }

  render() {
    const schema = {
      ...this.props.schema,
      title: `${this.props.schema.title}:${this.props.selectedId}`,
    };

    const uiSchema = {
      ...ShowDialog.makeStatic(this.props.schema),
      ...this.props.uiSchema, // overrite version:'hidden'
      id: { 'ui:widget': 'hidden' },
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
          <Button onClick={this.handleViewSchema.bind(this, schema, 'JSON Schema')} bsStyle="link" style={{ opacity: 0.2 }}>schema</Button>
          &nbsp;
          <Button onClick={this.handleViewSchema.bind(this, this.props.uiSchema, 'UI Schema')} bsStyle="link" style={{ opacity: 0.2 }}>uiSchema</Button>
          &nbsp;
          <Button onClick={this.handleViewSchema.bind(this, uiSchema, 'UI Schema2')} bsStyle="link" style={{ opacity: 0.2 }}>uiSchema 2</Button>
          &nbsp;
          <Button bsStyle="danger" onClick={this.handleDeleteButtonClicked.bind(this)}><i className="glyphicon glyphicon-trash" />Delete</Button>
          &nbsp;
          <Button bsStyle="primary" onClick={this.props.onEditButtonClicked}><i className="glyphicon glyphicon-pencil" />Edit</Button>
          &nbsp;
          <Button onClick={this.props.onClose}>Close</Button>
        </span>
      </ModalForm>
    );
  }
}

ShowDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  // eslint-disable-next-line
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
};
