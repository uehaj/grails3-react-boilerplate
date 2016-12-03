import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import Form from "react-jsonschema-form";

export default class ModalForm extends Component {

  render() {

    const CustomTitleField = ({title}) => {
      return (
          <div style={{ marginTop: '-10pt', marginLeft: '-10pt', marginRight: '-10pt', marginBottom: '15pt' }}>
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
          </div>
      );
    };

    const fields = {
      TitleField: CustomTitleField,
    };

    const { onClose, show, children, ...formProps} = this.props;

    return (
        <Modal show={show} onHide={onClose}>
        <div style={{ padding:'0' }}>
          <div style={{ padding: '15px' }}>
            <Form fields={fields} {...formProps}>
              <div style={{ borderTop: "1px solid #e5e5e5", textAlign: "right", marginLeft:'-15px', marginRight:'-15px', paddingTop: '15px' }}>
                <div style={{ marginRight: '15px' }}>
                  {children}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

ModalForm.propTypes = {
  formData: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  onSubmit: PropTypes.func,
};
