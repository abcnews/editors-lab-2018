const React = require('react');
const DOM = require('react-dom');

const PROJECT_NAME = 'editors-lab-2018';
const root = document.querySelector(`[data-${PROJECT_NAME}-root]`);

function init() {
  const App = require('./components/App');
  DOM.render(<App />, root);
}

init();

if (module.hot) {
  module.hot.accept('./components/App', () => {
    try {
      init();
    } catch (err) {
      const ErrorBox = require('./components/ErrorBox');
      DOM.render(<ErrorBox error={err} />, root);
    }
  });
}
