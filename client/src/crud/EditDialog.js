import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import ModalForm from '../components/ModalForm';

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
      const resp = await this.props.api.getEntity(nextProps.selectedId);
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

    const uiSchema = {
    };

    return (
      <ModalForm
        show={this.props.show}
        formData={this.state.formData}
        onClose={this.props.onClose}
        schema={this.props.schema}
        uiSchema={uiSchema}
        onSubmit={this.handleSubmit.bind(this)}
      >
        <span>
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
};
