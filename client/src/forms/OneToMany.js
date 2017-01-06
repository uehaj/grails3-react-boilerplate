import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default function OneToMany(crudConfig, props) {
  console.log(props);
  const { name, idSchema } = props;
  return (
    <div>
      <label className="control-label" htmlFor={idSchema['$id']}>
        {name}
      </label>
      <div id={idSchema['$id']}>
        <Link to={`/${crudConfig.ENTITIES_PATH}/book/1`}>1</Link>
      </div>
    </div>
  );
}
