import React, { Component, PropTypes } from 'react';
import AssociationLink from './AssociationLink';

class ManyToOneField extends Component {
  constructor() {
    super();
    this.state = {
      element: null,
    };
  }

  async componentDidMount() {
    console.log('manytoonefield.componentdidmount', this.props)
    const { schema, formData } = this.props;
    if (!formData) {
      return;
    }
    const domainClass = schema.domainClass;
    const ids = [this.props.formData.id];
    const resp = await this.props.api.searchById(domainClass, ids, { results: 'id,#toString' });
    const json = await resp.json();
    console.log('json=',json)
    // eslint-disable-next-line
    this.setState(
      { element: json[0] },
    );
  }

  render() {
    console.log('manytoonefield.render', this.props)
    const { crudConfig, name, schema, uiSchema, idSchema } = this.props;

    console.log('uiSchema=', uiSchema)
    console.log('domainClass=', schema.domainClass)
    console.log('element=', this.state.element)
    return (
      <div>
        <label className="control-label" htmlFor={idSchema.$id}>
          {name}
        </label>
        <div id={idSchema.$id}>
          <AssociationLink
            crudConfig={crudConfig}
            domainClass={schema.domainClass}
            element={this.state.element}
          />
        </div>
      </div>
    );
  }
}

ManyToOneField.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  api: PropTypes.objectOf(PropTypes.func).isRequired,
  name: PropTypes.string,
  schema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
};

// eslint-disable-next-line
export default (crudConfig, api, name) => class extends Component {
  render() {
    const additionalProps = { crudConfig, api, name };
    return <ManyToOneField {...additionalProps} {...this.props} />;
  }
};
