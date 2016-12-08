import React, { Component } from 'react';

export default function crudFor(WrappedComponent, entityName, schema) {
  return class extends Component {
    render() {
      return <WrappedComponent schema={schema} entityName={entityName} {...this.props}/>
    }
  }
};
