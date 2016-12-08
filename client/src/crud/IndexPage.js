import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';

import List from './List';
import CreateDialog from './CreateDialog';
import ShowDialog from './ShowDialog';
import EditDialog from './EditDialog';

function IndexPage(props) {
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
            <List CreateDialog={CreateDialog} ShowDialog={ShowDialog} EditDialog={EditDialog} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

IndexPage.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default IndexPage;
