import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';

import crudFor from './crudFor';
import List from './List';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.List = crudFor(List, {title: `List ${this.props.schema.title}`, ...this.props.schema}, this.props.api);
  }

  render() {
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
              <this.List schema={this.props.schema} {...this.props} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

IndexPage.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};
