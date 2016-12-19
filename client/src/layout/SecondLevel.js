import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

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
  return (
    <div>
      {/* Generate second level menu(Navbar). */}
      <SecondLevelNavbar route={props.route} />
      {/* Page content. */}
      <div style={{ marginTop: 60, paddingTop: 40 }}>
        {props.children}
      </div>
    </div>
  );
}

SecondLevel.propTypes = {
  route: PropTypes.object.isRequired,
  children: PropTypes.element,
};

/**
 * Second level menu navbar.
 */
function SecondLevelNavbar(props) {
  return (
    <Navbar inverse style={{ position: 'fixed', marginTop: -9, zIndex: 1, width: '100%', marginBottom: 0 }}>
      <Nav navbar>
        {
          (props.route.childRoutes ? props.route.childRoutes : []).map(item =>
            <LinkContainer key={item.name} to={`/${props.route.path}/${item.path}`}>
              <NavItem>{item.name}</NavItem>
            </LinkContainer>)
        }
      </Nav>
    </Navbar>
  );
}

SecondLevelNavbar.propTypes = {
  route: PropTypes.objectOf(PropTypes.object).required,
};
