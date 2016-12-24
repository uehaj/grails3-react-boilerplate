import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem, Tab, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NAVBAR_SECOND_LEVEL_DIRECTION } from '../config';

/**
 * Second level menu navbar(Horizontal).
 */
function SecondLevelNavbarHorizontal(props) {
  return (
    <div>
      <Navbar inverse style={{ position: 'fixed', marginTop: -9, zIndex: 1, width: '100%', marginBottom: 0 }}>
        <Nav navbar>
          {
            (props.route.childRoutes ? props.route.childRoutes : []).map(
              item =>
                <LinkContainer key={item.name} to={`/${props.route.path}/${item.path}`}>
                  <NavItem>{item.name}</NavItem>
                </LinkContainer>)
          }
        </Nav>
      </Navbar>
      {/* Page content. */}
      <div style={{ marginTop: 60, paddingTop: 40 }}>
        {props.children}
      </div>
    </div>
  );
}

SecondLevelNavbarHorizontal.propTypes = {
  route: PropTypes.objectOf(PropTypes.object).required,
  children: PropTypes.element,
};

/**
 * Second level menu navbar(Vertical).
 */
function SecondLevelNavbarVertical(props) {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="Book">
      <Row>
        <Col sm={2}>
          <div style={{ marginTop: 60, paddingLeft: '1em' }}>
            <Nav bsStyle="pills" stacked>
              {
                (props.route.childRoutes ? props.route.childRoutes : []).map(
                  item =>
                    <LinkContainer key={item.name} to={`/${props.route.path}/${item.path}`}>
                      <NavItem eventKey={item.name}>{item.name}</NavItem>
                    </LinkContainer>)
              }
            </Nav>
          </div>
        </Col>
      <Col sm={10} style={{ paddingTop: '10pt' }}>
          {props.children}
        </Col>
      </Row>
    </Tab.Container>
  );
}

SecondLevelNavbarVertical.propTypes = {
  route: PropTypes.objectOf(PropTypes.object).required,
  children: PropTypes.element,
};

/**
 * Second level structure.
 *
 * +-TopLevel--------------+
 * | TopLevelNavbar        |
 * | +-SecondLevel-------+ |
 * | | SecondLevelNavBar | |
 * | | {childlen}        | |
 * | +-------------------+ |
 * | footer                |
 * +-----------------------+
 */
export default function SecondLevel(props) {
  return (NAVBAR_SECOND_LEVEL_DIRECTION === 0)
    ? <SecondLevelNavbarHorizontal {...props} />
    : <SecondLevelNavbarVertical {...props} />;
}

SecondLevel.propTypes = {
  route: PropTypes.objectOf(PropTypes.object).isRequired,
  children: PropTypes.element,
};
