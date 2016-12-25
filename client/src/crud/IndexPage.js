import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';
import List from './List';

export default function IndexPage(props) {
  const { api, schema, uiSchema } = props.route;

  const style = (props.route.config.NAVBAR_SECOND_LEVEL_DIRECTION !== 0)
        ? { paddingTop: 40 } // vertical
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
            <List schema={schema} uiSchema={uiSchema} api={api} selectedId={props.params.selectedId}/>
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
