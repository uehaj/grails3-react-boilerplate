import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function getDomainUrlPath(domainClass) {
  return domainClass.substring(domainClass.lastIndexOf('.') + 1, domainClass.length);
}

export default function AssociationLink(props) {
  const { crudConfig, domainClass, element } = props;

  if (!element) {
    return null;
  }
  const domainUrlPath = getDomainUrlPath(domainClass);

  return (
    <Link to={`/${crudConfig.ENTITIES_PATH}/${domainUrlPath}/${element.id}`}>
      {element['#toString']}
    </Link>
  );
}

AssociationLink.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  domainClass: PropTypes.string,
  element: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
};
