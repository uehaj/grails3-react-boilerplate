import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import TopLevel from './layout/TopLevel';
import SecondLevel from './layout/SecondLevel';
import NotFound from './layout/NotFound';
import IndexPage from './crud/IndexPage';
import Page1 from './components/Page1';
import "bootstrap/dist/css/bootstrap.css";
import crudFor from './crud/crudFor';
import createRestApi from './util/api';

const api = createRestApi("book");

const bookSchema = {
  title: 'Book',
  type: 'object',
  required: ['title', 'price'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'no title' },
    price: { type: 'number', title: 'Price', default: 0 },
  },
};

const BookIndexPage = crudFor(IndexPage, bookSchema, api);

export default () => (
  <Router history={browserHistory}>
    <Route name="TOP" path="/" component={TopLevel}>
      <IndexRedirect from="*" to="book" />
      <Route path="book" name="booktable" component={SecondLevel}>
        <IndexRedirect from="*" to="list" />
        <Route path="list" name="list" component={BookIndexPage} />
      </Route>
      <Route path="m1" name="MenuItem1" component={SecondLevel}>
        <IndexRedirect from="*" to="p1" />
      </Route>
      <Route path="m2" name="MenuItem2" component={SecondLevel}>
        <IndexRedirect from="*" to="p4" />
      </Route>
      <Route path="p1" name="page1" component={Page1} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>);
