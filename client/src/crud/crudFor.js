import React, { Component } from 'react';

export default function crudFor(WrappedComponent, schema, api) {
  return class extends Component {
    render() {
      return <WrappedComponent schema={schema} api={api} {...this.props}/>
    }
  }
};
