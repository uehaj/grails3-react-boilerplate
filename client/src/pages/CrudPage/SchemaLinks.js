import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AlertBox from '../../components/AlertBox';

export default class SchemaLinks extends Component {

  handleViewSchema(json, title) {
    AlertBox.viewJson({ json, title });
    if (this.props.dialogClose) {
      this.props.dialogClose();
    }
  }

  render() {
    const { schema, uiSchema, formData } = this.props;
    return (
      <span>
        <Button onClick={this.handleViewSchema.bind(this, schema, 'Schema')} bsStyle="link" style={{ opacity: 0.2 }}>Schema</Button>
        <Button onClick={this.handleViewSchema.bind(this, uiSchema, 'uiSchema')} bsStyle="link" style={{ opacity: 0.2 }}>uiSchema</Button>
        {
          formData &&
            <Button onClick={this.handleViewSchema.bind(this, formData, 'formData')} bsStyle="link" style={{ opacity: 0.2 }}>formData</Button>
        }
      </span>
    );
  }
}

SchemaLinks.propTypes = {
  schema: PropTypes.shape({ title: PropTypes.string }),
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
  formData: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.string, PropTypes.array])),
  dialogClose: PropTypes.func,
};
