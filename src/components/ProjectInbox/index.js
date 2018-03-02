const { get } = require('axios');
const React = require('react');
const { FILE_TYPES } = require('../../constants');
const { getFileURL } = require('../../utils');
const styles = require('./styles.scss');

class ProjectInbox extends React.Component {
  constructor(props) {
    super(props);

    this.onProject = this.onProject.bind(this);

    this.state = {
      files: []
    };

    console.log(this.props);

    get(`/api/projects/${this.props.slug}`).then(response => {
      this.setState({ files: response.data.uploads });
    });
  }

  onProject({ files }) {
    this.setState({ files });
  }

  render() {
    const hasAnyFileUploadsYet = this.state.files.some(file => file.filename);

    return (
      <div className={styles.root}>
        {!hasAnyFileUploadsYet && (
          <div className={styles.project}>
            <h2>Your project has been created!</h2>
            <p>Share this URL with people for them to submit files</p>
            <p>
              <code className={styles.projectURL}>{`${window.location.toString().replace('/inbox', '')}`}</code>
            </p>
          </div>
        )}
        <div className={styles.files}>
          {this.state.files.map(file => (
            <div className={styles.file}>
              {`File (type: ${FILE_TYPES[file.type]})`}
              {file.filename ? (
                <a href={getFileURL(file)} download>
                  <img src={getFileURL(file)} />
                </a>
              ) : (
                '(waiting on submission)'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

module.exports = ProjectInbox;
