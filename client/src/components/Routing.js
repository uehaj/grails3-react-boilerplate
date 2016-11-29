import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { TopLevel, SecondLevel, NotFound } from './navi/navi';
import BookIndexPage from './BookIndexPage';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';

export default () => (
  <Router history={browserHistory}>
    <Route name="TOP" path="/" component={TopLevel}>
      <IndexRedirect from="*" to="book" />
      <Route path="book" name="booktable" component={SecondLevel}>
        <IndexRedirect from="*" to="list" />
        <Route path="list" name="list" component={BookIndexPage} />
        <Route path="p1" name="page1" component={Page1} />
        <Route path="p2" name="page2" component={Page2} />
        <Route path="p3" name="page3" component={Page3} />
      </Route>
      <Route path="m1" name="MenuItem1" component={SecondLevel}>
        <IndexRedirect from="*" to="p1" />
        <Route path="p1" name="page1" component={Page1} />
        <Route path="p2" name="page2" component={Page2} />
        <Route path="p3" name="page3" component={Page3} />
      </Route>
      <Route path="m2" name="MenuItem2" component={SecondLevel}>
        <IndexRedirect from="*" to="p4" />
        <Route path="p4" name="page4" component={Page4} />
        <Route path="p5" name="page2" component={Page5} />
      </Route>
      <Route path="p1" name="page1" component={Page1} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>);
