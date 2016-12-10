import React from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import TopLevel from './layout/TopLevel';
import SecondLevel from './layout/SecondLevel';
import NotFound from './layout/NotFound';
import IndexPage from './crud/IndexPage';
import Page1 from './components/Page1';
import crudFor from './crud/crudFor';
import createRestApi from './util/api';
import "bootstrap/dist/css/bootstrap.css";

const bookApi = createRestApi("book");

const bookSchema = {
  title: 'Book',
  type: 'object',
  required: ['title', 'price'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'no title' },
    price: { type: 'number', title: 'Price', default: 0 },
  },
};

const BookIndexPage = crudFor(IndexPage, bookSchema, bookApi);

const authorApi = createRestApi("author");

const authorSchema = {
  title: 'Author',
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: { type: 'string', title: 'Name', default: 'no name' },
    age: { type: 'number', title: 'Age', default: 0 },
  },
};

const AuthorIndexPage = crudFor(IndexPage, authorSchema, authorApi);

export default () => (
  <Router history={browserHistory}>
    <Route name="TOP" path="/" component={TopLevel}>
      {/* add top level items here.*/}
      <IndexRedirect from="*" to="resources" />
      {/* add crud pages here. */}
      <Route path="resources" name="resources" component={SecondLevel}>
        <IndexRedirect from="*" to="book" />
        <Route path="book" name="book" component={BookIndexPage} />
        <Route path="book2" name="book2" component={BookIndexPage} />
        <Route path="book3" name="book3" component={BookIndexPage} />
        <Route path="book4" name="book4" component={BookIndexPage} />
        <Route path="book5" name="book5" component={BookIndexPage} />
        <Route path="book6" name="book6" component={BookIndexPage} />
        <Route path="author" name="author" component={AuthorIndexPage} />
      </Route>
      {/*
      <Route path="m1" name="MenuItem1" component={SecondLevel}>
        <IndexRedirect from="*" to="p1" />
      </Route>
      <Route path="m2" name="MenuItem2" component={SecondLevel}>
        <IndexRedirect from="*" to="p4" />
      </Route>
      <Route path="p1" name="page1" component={Page1} />
      */}
    </Route>
    <Route path="*" component={NotFound} />
  </Router>);
