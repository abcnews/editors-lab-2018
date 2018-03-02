const { h, Component } = require('preact');
// const { BrowserRouter, Route, Switch } = require('react-router-dom');
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
          <ProjectInbox path="/inbox/:slug" />
          <Project path="/:slug" />
        </Router>
      </div>
    );
  }
}

// class App extends Component {
//   render() {
//     return (
//       <BrowserRouter>
//         <div className={styles.root}>
//           <Switch>
//             <Route exact path="/" component={Home} />
//             <Route path="/:slug/inbox" component={ProjectInbox} />
//             <Route path="/:slug" component={Project} />
//           </Switch>
//         </div>
//       </BrowserRouter>
//     );
//   }
// }

module.exports = App;
