import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';
import crudFor from './crudFor';

import _List from './List';
import _CreateDialog from './CreateDialog';
import _ShowDialog from './ShowDialog';
import _EditDialog from './EditDialog';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.List = crudFor(_List, this.props.entityName, {title: 'List book', ...this.props.schema});
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
              <this.List {...this.props} />
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
