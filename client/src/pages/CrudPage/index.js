import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Breadcrumbs from 'react-breadcrumbs';
import List from './List';

function CrudPage(props) {
  const { api, schema, uiSchema } = props.route;

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
              api={api}
              selectedId={props.params.selectedId}
              crudConfig={props.route.crudConfig}
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
    selectedId: PropTypes.number,
  }),
  // eslint-disable-next-line
  route: PropTypes.object,
};

export default CrudPage;
