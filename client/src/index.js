import React from 'react';
import ReactDOM from 'react-dom';
import './css/stickey-footer.css';
import Routing from './components/Routing';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <Routing />,
  rootEl);


if (module.hot) {
  module.hot.accept('./components/Routing', () => {
    // eslint-disable-next-line
    const NextApp = require('./components/Routing').default;
    ReactDOM.render(
      <NextApp />,
      rootEl,
    );
  });
}
