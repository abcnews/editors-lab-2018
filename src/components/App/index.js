const { h, Component } = require('preact');
const FileUpload = require('../FileUpload');
const styles = require('./styles.scss');

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <FileUpload id={'random'} onUploaded={console.log} />
      </div>
    );
  }
}

module.exports = App;
