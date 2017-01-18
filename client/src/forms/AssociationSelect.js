import React, { Component, PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';
import api from '../util/api';

export default class AssociationSelect extends Component {
  constructor() {
    super();
    this.state = {
      allOptions: [],
    };
  }

  async componentDidMount() {
    const { crudConfig, schema, formData } = this.props;
    if (!formData) {
      return;
    }
    const domainClass = schema.items.domainClass;
    const ids = this.props.formData.map(elem => elem.id);
    const restApi = api.createRestApi(crudConfig.SERVER_URL, domainClass);
    const resp = await restApi.searchById(domainClass, ids, { results: 'id,#toString' });
    const json = await resp.json();
    // eslint-disable-next-line
    this.setState(
      { elements: json },
    );
  }

  render() {
    const { element } = this.props;
    if (!element) {
      return null;
    }
    return (
      <FormControl componentClass="select">
        <option value={element.id}>{element['#toString'].toString()}</option>
      </FormControl>
    );
  }
}

AssociationSelect.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  domainClass: PropTypes.string,
  element: PropTypes.arrayOf(PropTypes.object),
};
