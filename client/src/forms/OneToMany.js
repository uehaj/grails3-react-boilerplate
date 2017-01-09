import React, { PropTypes } from 'react';
import { Link } from 'react-router';


function getEntityName(domainClassName) {
  return domainClassName.substring(domainClassName.lastIndexOf('.') + 1, domainClassName.length);
}

export default function OneToMany(crudConfig, api, props) {
  const { name, schema, idSchema, formData } = props;

  const entityName = getEntityName(schema.items.domainClassName);

  return (
    <div>
      <label className="control-label" htmlFor={idSchema.$id}>
        {name}
      </label>
      <div id={idSchema.$id}>
        <ul>
          {
            formData &&
              formData.map(elem => <li key={elem.id}><Link to={`/${crudConfig.ENTITIES_PATH}/${entityName}/${elem.id}`}>{elem.id}</Link></li>)
          }
        </ul>
      </div>
    </div>
  );
}

OneToMany.propTypes = {
  name: PropTypes.string,
  schema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.objectOf(PropTypes.string),
  formData: PropTypes.shape({}),
};
