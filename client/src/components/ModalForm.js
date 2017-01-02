import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import Form from 'react-jsonschema-form';

// eslint-disable-next-line
export default class ModalForm extends Component {

  render() {
    console.log("0=",this.props);
    const CustomTitleField = ({ title }) =>
      <div style={{ marginTop: '-10pt', marginLeft: '-10pt', marginRight: '-10pt', marginBottom: '15pt' }}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      </div>;

    const fields = {
      ...this.props.fields,
      TitleField: CustomTitleField,
    };
    console.log("1-1=",this.props.fields);
    console.log("1-2=",fields);

    const { onClose, show, children, ...formProps } = this.props;

    const style = {
      borderTop: '1px solid #e5e5e5',
      textAlign: 'right',
      marginLeft: '-15px',
      marginRight: '-15px',
      paddingTop: '15px',
    };
    console.log('2=',this.props.uiSchema);

    return (
      <Modal show={show} onHide={onClose}>
        <div style={{ padding: '15px' }}>
          <Form fields={fields} {...formProps}>
            <div style={style}>
              <div style={{ marginRight: '15px' }}>
                {children}
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

ModalForm.propTypes = {
  formData: PropTypes.shape({}),
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schema: PropTypes.shape({}),
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func,
  children: PropTypes.element.isRequired,
  fields: PropTypes.objectOf(PropTypes.func),
};
