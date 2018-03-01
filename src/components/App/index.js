const { h, Component } = require('preact');
const { Router } = require('preact-router');
const Home = require('../Home');
const Project = require('../Project');
const ProjectInbox = require('../ProjectInbox');
const styles = require('./styles.scss');

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <Router>
          <Home path="/" />
          <Project path="/:slug" />
          <ProjectInbox path="/:slug/inbox" />
        </Router>
      </div>
    );
  }
}

module.exports = App;
