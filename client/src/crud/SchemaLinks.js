import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import AlertBox from '../components/AlertBox';

export default class SchemaLinks extends Component {
  handleViewSchema(json, title) {
    AlertBox.viewJson({ json, title });
  }

  render() {
    const { schema, uiSchema } = this.props;
    return (
      <span>
        <Button onClick={this.handleViewSchema.bind(this, schema, 'JSON Schema')} bsStyle="link" style={{ opacity: 0.2 }}>JSON Schema</Button>
        <Button onClick={this.handleViewSchema.bind(this, uiSchema, 'UI Schema')} bsStyle="link" style={{ opacity: 0.2 }}>UI Schema 2</Button>
      </span>
    );
  }
}

SchemaLinks.propTypes = {
  schema: PropTypes.shape({ title: PropTypes.string }),
  uiSchema: PropTypes.objectOf(PropTypes.object).isRequired,
};
