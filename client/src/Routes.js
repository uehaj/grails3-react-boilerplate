import React, { Component } from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';
import AlertBox from './components/AlertBox';
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
    try {
      const resp = await entityApi.getEntities();
      const entitiesInfo = await resp.json();
      this.setState({ entitiesInfo });
    } catch (err) {
      const json = await err.json();
      AlertBox.error(`Error: ${json.message}`);
    }
  }

  render() {
    const entitiesInfo = this.state.entitiesInfo;

    if (entitiesInfo.length === 0) {
      return (<div>loading...</div>);
    }

    const firstEntity = entitiesInfo.slice(entitiesInfo.length - 1, entitiesInfo.length);

    const IndexRoute = firstEntity.map(item => <IndexRedirect from="*" to={item.name} />);

    const entityRoutes = this.state.entitiesInfo.map(info =>
      <Route
        path={info.name}
        name={info.name}
        key={info.name}
        api={createRestApi(info.name)}
        schema={info.schema}
        uiSchema={info.uiSchema}
        component={IndexPage}
      />);
    return (
      <Router history={browserHistory}>
        <Route name="TOP" path="/" component={TopLevel}>
          {/* add top level items here.*/}
          <IndexRedirect from="*" to="entities" />
          {/* add crud pages here. */}
          <Route path="entities" name="Entities" component={SecondLevel}>
            {IndexRoute}
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
