import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import config from './config';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <Routes config={config}/>,
  rootEl);

if (module.hot) {
  module.hot.accept('./Routes', () => {
    // eslint-disable-next-line
    const NextRoutes = require('./Routes').default;
    ReactDOM.render(
      <NextRoutes config={config}/>,
      rootEl,
    );
  });
}
