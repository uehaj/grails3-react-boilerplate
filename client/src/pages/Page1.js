import React from 'react';
import Breadcrumbs from 'react-breadcrumbs';

export default function Page1({ routes }) {
  return (
    <div style={{ paddingTop: 40 }}>
      <div style={{ marginTop: '10px' }}>
        <Breadcrumbs
          wrapperElement="ol"
          itemElement="li"
          customClass="breadcrumb"
          separator=""
          routes={routes}
        />
      </div>
      <div style={{ paddingLeft: '1em' }}>
        Page1.
      </div>
    </div>
  );
}

Page1.propTypes = {
  routes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};
