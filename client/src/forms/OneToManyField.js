import React, { Component, PropTypes } from 'react';
import AssociationLinks from './AssociationLinks';

export default class OneToManyField extends Component {
  constructor() {
    super();
    this.state = {
      elements: [],
    };
  }

  async componentDidMount() {
    const { api, schema, formData } = this.props;
    if (!formData) {
      return;
    }
    const domainClass = schema.items.domainClass;
    const ids = this.props.formData.map(elem => elem.id);
    const resp = await api.searchById(domainClass, ids, { results: 'id,#toString' });
    const json = await resp.json();
    // eslint-disable-next-line
    this.setState(
      { elements: json },
    );
  }

  render() {
    const { crudConfig, name, schema, idSchema } = this.props;

    return (
      <div>
        <label className="control-label" htmlFor={idSchema.$id}>
          {name}
        </label>
        <div id={idSchema.$id}>
          <AssociationLinks
            crudConfig={crudConfig}
            domainClass={schema.items.domainClass}
            elements={this.state.elements}
          />
        </div>
      </div>
    );
  }
}

OneToManyField.propTypes = {
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
