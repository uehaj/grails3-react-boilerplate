import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';
import AlertBox from '../components/AlertBox';

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

    /* replace input tag to normal text */
    const StaticText = props => <div>{props.value}</div>;

    const uiSchema = {
      ...this.props.uiSchema,
      /*
        Generate additional ui customize entries for each property like:
        title: {'ui:widget': StaticText}
        price: {'ui:widget': StaticText}
        :
      */
      ...(Object.keys(this.props.schema.properties)
          .reduce(
            (map, key) =>
              ({ ...map, [key]: { 'ui:widget': StaticText } }),
            {})),
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
          <Button onClick={this.handleViewSchema.bind(this, schema, "JSON Schema")} bsStyle="link" style={{ opacity: 0.2 }}>schema</Button>
          &nbsp;
          <Button onClick={this.handleViewSchema.bind(this, uiSchema, "UI Schema")} bsStyle="link" style={{ opacity: 0.2 }}>uiSchema</Button>
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
