import React, { PropTypes } from 'react';
import { FormControl } from 'react-bootstrap';

export default function AssociationMultiSelect(props) {
  const { crudConfig, domainClass, elements } = props;
  if (!elements) {
    return null;
  }
  return (
    <FormControl componentClass="select">
      {
        elements.map(element =>
          <option value={element.id}>{element['#toString']}</option>)
      }
    </FormControl>
  );
}

AssociationMultiSelect.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  domainClass: PropTypes.string,
  elements: PropTypes.arrayOf(PropTypes.object),
};
