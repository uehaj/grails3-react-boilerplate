import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';
import config from '../config';
import List from './List';

export default function IndexPage(props) {
  const { api, schema, uiSchema } = props.route;
  const style = (config.NAVBAR_SECOND_LEVEL_DIRECTION !== 0)
        ? { paddingTop: 40 }
        : {};
  return (
    <div style={style}>
      <Breadcrumbs
        wrapperElement="ol"
        itemElement="li"
        customClass="breadcrumb"
        separator=""
        routes={props.routes}
      />
      <Grid fluid style={{ marginTop: '-20px' }}>
        <Row>
          <Col md={12} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <List schema={schema} uiSchema={uiSchema} api={api} />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

IndexPage.propTypes = {
  route: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ])).isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
