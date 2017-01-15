import React, { PropTypes } from 'react';
import AssociationLink from './AssociationLink';

export default function AssociationLinks(props) {
  const { crudConfig, domainClass, elements } = props;
  if (!elements) {
    return null;
  }
  return (
    <ul>
      {
        elements.map(elem =>
          <li key={elem.id}>
            <AssociationLink
              crudConfig={crudConfig}
              domainClass={domainClass}
              element={elem}
            />
          </li>)
      }
    </ul>);
}

AssociationLinks.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  domainClass: PropTypes.string,
  elements: PropTypes.arrayOf(PropTypes.object),
};
