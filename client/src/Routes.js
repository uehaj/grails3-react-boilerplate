import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import 'bootstrap/dist/css/bootstrap.css';
import AlertBox from './components/AlertBox';
import TopLevel from './layout/TopLevel';
import SecondLevel from './layout/SecondLevel';
import NotFound from './layout/NotFound';
import CrudPage from './pages/CrudPage';
import Page1 from './pages/Page1';
import createRestApi from './util/api';

export default class Routes extends Component {

  constructor(props) {
    super(props);
    this.state = { entitiesInfo: [] };
  }

  async componentWillMount() {
    const urlBase = this.props.crudConfig.SERVER_URL;
    const entityApi = createRestApi(urlBase, 'domainInfo');
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

    const IndexRoute = firstEntity.map(item => <IndexRedirect key="first" from="*" to={item.name} />);

    const urlBase = this.props.crudConfig.SERVER_URL;

    const entitiesRoutes = this.state.entitiesInfo.map(info =>
      <Route
        path={`${info.name}(/:selectedId)`}
        name={info.name}
        key={info.name}
        api={createRestApi(urlBase, info.name)}
        schema={info.schema}
        uiSchema={info.uiSchema}
        component={CrudPage}
        crudConfig={this.props.crudConfig}
                                                       />);

    const entitiesPath = this.props.crudConfig.ENTITIES_PATH;

    return (
      <Router history={browserHistory}>
        <Route name="TOP" path="/" component={TopLevel}>
          {/* add top level items here.*/}
          <IndexRedirect from="*" to="entities" />
          {/* crud pages. */}
          <Route path={entitiesPath} name="Entities" component={SecondLevel} crudConfig={this.props.crudConfig}>
            {IndexRoute}
            {entitiesRoutes}
          </Route>

          {/**/}
          <Route path="m1" name="MenuItem1" component={SecondLevel}>
            <IndexRedirect from="*" to="p1" />
          </Route>
          <Route path="m2" name="MenuItem2" component={SecondLevel}>
            <IndexRedirect from="*" to="p4" />
          </Route>
          <Route path="p1" name="page1" component={Page1} />
          {/**/}

        </Route>
        <Route path="*" component={NotFound} />
      </Router>
    );
  }
}

Routes.propTypes = {
  crudConfig: PropTypes.shape({
    SERVER_URL: PropTypes.string,
    CLIENT_VERSION: PropTypes.string,
    REACT_VERSION: PropTypes.string,
    NAVBAR_SECOND_LEVEL_DIRECTION: PropTypes.number,
    SHOW_BREADCRUMBS: PropTypes.bool,
    SHOW_SCHEMA_LINKS: PropTypes.bool,
    ENTITIES_PATH: PropTypes.string,
  }).isRequired,
};

