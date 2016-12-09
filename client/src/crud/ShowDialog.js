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
    if (nextProps.selectedId !== this.props.selectedId) {
      const {api} = this.props;
      console.log(api);
      const resp = await api.getEntity(nextProps.selectedId);
      const json = await resp.json();
      this.setState({ formData: json });
    }
  }

  render() {
    /* replace input tag to normal text */
    const func = props => <div>{props.value}</div>;

    const uiSchema = {
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
    };

    return (
      <ModalForm
        show={this.props.show}
        formData={this.state.formData}
        onClose={this.props.onClose}
        schema={this.props.schema}
        uiSchema={uiSchema}
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
  selectedId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onEditButtonClicked: PropTypes.func.isRequired,
};
