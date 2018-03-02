const React = require('react');
const { BrowserRouter, Route, Switch } = require('react-router-dom');
const Home = require('../Home');
const Project = require('../Project');
const ProjectInbox = require('../ProjectInbox');
const styles = require('./styles.scss');

// class App extends Component {
//   render() {
//     return (
//       <div className={styles.root}>
//         <Router>
//           <Home path="/" />
//           <ProjectInbox path="/inbox/:slug" />
//           <Project path="/:slug" />
//         </Router>
//       </div>
//     );
//   }
// }

class NotFound extends React.Component {
  render() {
    return <div>Not found</div>;
  }
}

class App extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:slug/inbox" component={ProjectInbox} />
            <Route exact path="/:slug" component={Project} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

module.exports = App;
