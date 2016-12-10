import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';

import List from './List';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { api, schema } = this.props.route;
    const { title } = schema;

    return (
      <div>
        <Breadcrumbs
          wrapperElement="ol"
          itemElement="li"
          customClass="breadcrumb"
          separator=""
          routes={this.props.routes}
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
}

IndexPage.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  schema: PropTypes.object.isRequired,
  api: PropTypes.object.isRequired,
};
