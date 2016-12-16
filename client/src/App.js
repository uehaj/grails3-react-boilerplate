import React, { Component } from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import TopLevel from './layout/TopLevel';
import SecondLevel from './layout/SecondLevel';
import NotFound from './layout/NotFound';
import IndexPage from './crud/IndexPage';
import Page1 from './components/Page1';
import createRestApi from './util/api';
import "bootstrap/dist/css/bootstrap.css";

const bookApi = createRestApi("book");

let bookSchema = {
  title: 'XXBook',
  type: 'object',
  required: ['title', 'price'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'no title' },
    price: { type: 'number', title: 'Price', default: 0 },
  },
};

const authorApi = createRestApi("author");

let authorSchema = {
  title: 'XXAuthor',
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: { type: 'string', title: 'Name', default: 'no name' },
    age: { type: 'number', title: 'Age', default: 0 },
  },
};

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { entitiesInfo: [] };
  }

  async componentDidMount() {
    const entityApi = createRestApi('domainInfo');
    const response = await entityApi.getEntities();
    const entitiesInfo = await response.json();
    this.setState({ entitiesInfo });
  }

  render() {
    console.log("bookSchema",JSON.stringify(bookSchema));
    console.log("authorSchema",JSON.stringify(authorSchema));
    this.state.entitiesInfo.map(info => {
      console.log('render2', JSON.stringify(info.schema));
    });

    if (this.state.entitiesInfo.length === 0) {
      return <div>loading..</div>;
    }

    if (this.state.entitiesInfo.length !== 0) {
      console.log(this.state.entitiesInfo)
      authorSchema = this.state.entitiesInfo[0].schema;
      bookSchema = this.state.entitiesInfo[1].schema;
      console.log("bookSchema update",JSON.stringify(bookSchema));
      console.log("authorSchema update",JSON.stringify(authorSchema));
    }

    function Wrap(Comp, api, schema) {
      return class extends Component {
        render() {
          return <Comp api={api} schema={schema} {...this.props} />;
        }
      };
    }

    return (
      <Router history={browserHistory}>
        <Route name="TOP" path="/" component={TopLevel}>
          {/* add top level items here.*/}
          <IndexRedirect from="*" to="resources" />
          {/* add crud pages here. */}
          <Route path="resources" name="resources" component={SecondLevel}>
            <IndexRedirect from="*" to="book" />
            <Route path="book" name="book" api={bookApi} schema={bookSchema} component={IndexPage} />
            <Route path="author" name="author" api={authorApi} schema={authorSchema} component={IndexPage} />
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
      </Router>
    );
  }
}
