import React, { Component, PropTypes } from 'react';
import api from '../util/api';

export default class ManyToOneField extends Component {
  constructor() {
    super();
    this.state = {
      element: null,
    };
  }

  async componentDidMount() {
    const { crudConfig, schema, formData } = this.props;
    if (!formData) {
      return;
    }
    const domainClass = schema.domainClass;
    const ids = [this.props.formData.id];
    const restApi = api.createRestApi(crudConfig.SERVER_URL, domainClass);
    const resp = await restApi.searchById(domainClass, ids, { results: 'id,#toString' });
    const json = await resp.json();

    /// ここを★かんがえる。elementは何か？
    // eslint-disable-next-line
    this.setState(
      { element: json[0] },
    );
  }

  render() {
    const { crudConfig, AssocComponent, name, schema, idSchema } = this.props;

    return (
      <div>
        <label className="control-label" htmlFor={idSchema.$id}>
          {name}
        </label>
        <div id={idSchema.$id}>
          <AssocComponent
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
  AssocComponent: PropTypes.element,
  name: PropTypes.string,
  schema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])),
  formData: PropTypes.objectOf(PropTypes.object),
};
