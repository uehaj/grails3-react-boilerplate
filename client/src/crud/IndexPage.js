import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';

import List from './List';

export default function IndexPage(props) {
  const { api, schema } = props.route;
  console.log("IndexPage",api);
  return (
    <div>
      <Breadcrumbs
        wrapperElement="ol"
        itemElement="li"
        customClass="breadcrumb"
        separator=""
        routes={props.routes}
      />
      <Grid fluid>
        <Row>
          <Col md={12} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <List schema={schema} api={api} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

IndexPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.object).isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
