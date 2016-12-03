import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './stickey-footer.css';
import logo from '../images/favicon48.png';

/**
 * Application top level structure.
 *
 * +-TopLevel--------------+
 * | TopLevelNavbar        |
 * | +-SecondLevel-------+ |
 * | | SecondLevelNavBar | |
 * | | {childlen}        | |
 * | +-------------------+ |
 * | footer                |
 * +-----------------------+
 *
 */
export default function TopLevel(props) {
  return (
    <div>
      {/* Top level menu(Navbar)*/}
      <TopLevelNavbar route={props.route} />
      {props.children}
      <footer className="footer">
        <div className="container">
          <p className="text-muted">Place sticky footer content here.</p>
        </div>
      </footer>
    </div>
  );
}

TopLevel.propTypes = {
  route: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.element.isRequired,
};

/**
 * Top level menu navbar.
 */
function TopLevelNavbar(props) {
  return (
    <Navbar fixedTop>
      <Navbar.Header>
        <Navbar.Brand>
          <img src={logo} role="presentation" />
        </Navbar.Brand>
        <Navbar.Brand>
        <a href="#dummy">React/Grails Boilerplate</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          {/* Generate top level Navbar menu items from router. */}
          {
            props.route.childRoutes.map(
              item =>
                <LinkContainer
                  key={item.path}
                  to={`/${item.path}`}
                >
                  <NavItem>{item.name}</NavItem>
                </LinkContainer>)
          }
        </Nav>
        {/* Right side drop down menu items. */}
        <Nav pullRight>
          <NavDropdown eventKey={1} title="Dropdown" id="collapsible-nav-dropdown">
            <MenuItem eventKey={1.1} href="/">TOP</MenuItem>
            <MenuItem eventKey={1.2} href="/changepassword">Change Password</MenuItem>
            <MenuItem eventKey={1.3} href="/logout">Logout</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

TopLevelNavbar.propTypes = {
  route: PropTypes.arrayOf(PropTypes.object).isRequired,
};
