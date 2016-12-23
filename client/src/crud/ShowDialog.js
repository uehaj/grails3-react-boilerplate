import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';

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

  render() {
    /* replace input tag to normal text */
    const func = props => <div>{props.value}</div>;

    const uiSchema = {
      ...this.props.uiSchema,
      /*
        Generate entries for each property like:
        title: {'ui:widget': func}
        price: {'ui:widget': func}
        :
      */
      ...(Object.keys(this.props.schema.properties)
          .reduce(
            (map, key) =>
              ({ ...map, [key]: { 'ui:widget': func } }),
            {})),
      id: { 'ui:widget': 'hidden' },
    };

    return (
      <ModalForm
        show={this.props.show}
        formData={this.state.formData}
        onClose={this.props.onClose}
        schema={this.props.schema}
        uiSchema={uiSchema}
        liveValidate
      >
        <span>
          <Button
            bsStyle="primary"
            onClick={this.props.onEditButtonClicked}
          >
            Edit
          </Button>
          <Button
            onClick={this.props.onClose}
          >
            Close
          </Button>
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
  schema: PropTypes.objectOf(
    PropTypes.oneOfType(
      [
        PropTypes.string,
        PropTypes.object,
        PropTypes.boolean,
      ])).isRequired,
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  api: PropTypes.objectOf(PropTypes.func).isRequired,
};
