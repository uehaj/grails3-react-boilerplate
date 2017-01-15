import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function getDomainUrlPath(domainClass) {
  return domainClass.substring(domainClass.lastIndexOf('.') + 1, domainClass.length);
}

export default function AssociationLinks(props) {
  const { crudConfig, domainClass, elements } = props;
  if (!elements) {
    return null;
  }
  const domainUrlPath = getDomainUrlPath(domainClass);

  return (
    <ul>
      {
        elements.map(elem =>
          <li key={elem.id}>
            <Link to={`/${crudConfig.ENTITIES_PATH}/${domainUrlPath}/${elem.id}`}>
              {elem['#toString']}
            </Link>
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
