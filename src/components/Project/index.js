const { get, post } = require('axios');
const { Route } = require('react-router-dom');
const { withRouter } = require('react-router');
const React = require('react');
const { FILE_TYPES } = require('../../constants');
const { getFileURL } = require('../../utils');
const FileUpload = require('../FileUpload');
const styles = require('./styles.scss');

const ProjectInbox = require('../ProjectInbox');

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.onFileUploaded = this.onFileUploaded.bind(this);
    // this.done = this.done.bind(this);

    this.state = {
      files: [],
      isDone: false
    };

    get(`/api/projects/${this.props.match.params.slug}`).then(response => {
      this.setState({ files: response.data.uploads });
    });
  }

  onFileUploaded({ slug, data }) {
    this.setState({
      files: this.state.files.reduce((memo, file) => {
        if (file.slug === slug) {
          file.filename = data.filename;
        }

        memo.push(file);

        return memo;
      }, [])
    });
  }

  // done() {
  //   post(DONE_URL, new FormData()).then(response => {
  //     // TODO: Thank you page?
  //   });

  //   this.setState({ isDone: true });
  // }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.files}>
          {this.state.files.map(file => (
            <div className={styles.file}>
              {`File (type: ${FILE_TYPES[file.type]})`}
              {file.notes && <p>{file.notes}</p>}
              {file.filename ? (
                <img src={getFileURL(file)} />
              ) : (
                <FileUpload
                  project={this.props.match.params.slug}
                  upload={file.slug}
                  onUploaded={this.onFileUploaded}
                />
              )}
            </div>
          ))}
        </div>
        {/* {this.state.isDone ? null : (
          <button className={styles.done} onClick={this.done}>
            I'm done!
          </button>
        )} */}
      </div>
    );
  }
}

module.exports = withRouter(Project);
