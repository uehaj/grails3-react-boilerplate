import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';
import List from './List';

function CrudPage(props) {
  const { schema, uiSchema } = props.route;

  const style = (props.route.crudConfig.NAVBAR_SECOND_LEVEL_DIRECTION !== 0)
        ? { paddingTop: 40 } // vertical
        : {};

  const breadcrumbs = (props.route.crudConfig.SHOW_BREADCRUMBS)
        &&
        (
          <div style={{ marginTop: '10px' }}>
            <Breadcrumbs
              wrapperElement="ol"
              itemElement="li"
              customClass="breadcrumb"
              separator=""
              routes={props.routes}
            />
          </div>
        );

  return (
    <div style={style}>
      {breadcrumbs}
      <Grid fluid style={{ marginTop: '-15px' }}>
        <Row>
          <Col md={12} style={{ paddingLeft: '1em', paddingRight: '1em' }}>
            <List
              schema={schema}
              uiSchema={uiSchema}
              selectedId={parseInt(props.params.selectedId, 10)}
              crudConfig={props.route.crudConfig}
              domainClass={props.route.domainClass}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

CrudPage.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  params: PropTypes.shape({
    selectedId: PropTypes.string,
  }),
  // eslint-disable-next-line
  route: PropTypes.object,
};

export default CrudPage;
