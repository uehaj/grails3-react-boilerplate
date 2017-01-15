import React, { Component, PropTypes } from 'react';
import AssociationLink from './AssociationLink';

export default class ManyToOneField extends Component {
  constructor() {
    super();
    this.state = {
      element: null,
    };
  }

  async componentDidMount() {
    const { api, schema, formData } = this.props;
    if (!formData) {
      return;
    }
    const domainClass = schema.domainClass;
    const ids = [this.props.formData.id];
    const resp = await api.searchById(domainClass, ids, { results: 'id,#toString' });
    const json = await resp.json();
    // eslint-disable-next-line
    this.setState(
      { element: json[0] },
    );
  }

  render() {
    const { crudConfig, name, schema, uiSchema, idSchema } = this.props;

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
  formData: PropTypes.objectOf(PropTypes.object),
};
