import React, { Component } from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';
import TopLevel from './layout/TopLevel';
import SecondLevel from './layout/SecondLevel';
import NotFound from './layout/NotFound';
import IndexPage from './crud/IndexPage';
// import Page1 from './components/Page1';
import createRestApi from './util/api';

export default class Routes extends Component {

  constructor(props) {
    super(props);
    this.state = { entitiesInfo: [] };
  }

  async componentWillMount() {
    const entityApi = createRestApi('domainInfo');
    const response = await entityApi.getEntities();
    const entitiesInfo = await response.json();
    this.setState({ entitiesInfo });
  }

  render() {
    if (this.state.entitiesInfo.length === 0) {
      return <div>loading..</div>;
    }

    const entityRoutes = this.state.entitiesInfo.map(info =>
      <Route
        path={info.name}
        name={info.name}
        api={createRestApi(info.name)}
        schema={info.schema}
        component={IndexPage}
      />);

    return (
      <Router history={browserHistory}>
        <Route name="TOP" path="/" component={TopLevel}>
          {/* add top level items here.*/}
          <IndexRedirect from="*" to="resources" />
          {/* add crud pages here. */}
          <Route path="resources" name="resources" component={SecondLevel}>
            <IndexRedirect from="*" to="book" />
            {entityRoutes}
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
