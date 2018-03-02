const { get, post } = require('axios');
const { Route } = require('react-router-dom');
const { withRouter } = require('react-router');
const React = require('react');
const { FILE_TYPES } = require('../../constants');
const { getFileURL } = require('../../utils');
const FileUpload = require('../FileUpload');
const ProjectInbox = require('../ProjectInbox');
const Thumbnail = require('../Thumbnail');
const styles = require('./styles.scss');

class Project extends React.Component {
  constructor(props) {
    super(props);

    this.onFilePreview = this.onFilePreview.bind(this);
    this.onFileUploaded = this.onFileUploaded.bind(this);
    this.done = this.done.bind(this);

    this.state = {
      files: [],
      isDone: false
    };

    get(`/api/projects/${this.props.match.params.slug}`).then(response => {
      this.setState({ hasEmail: !!response.data.email, files: response.data.uploads });
    });
  }
  onFilePreview({ slug, data }) {
    if (data.url) {
      this.setState({
        files: this.state.files.reduce((memo, file) => {
          if (file.slug === slug) {
            file.previewURL = data.url;
          }

          memo.push(file);

          return memo;
        }, [])
      });
    }
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

  done() {
    post(`/api/projects/${this.props.match.params.slug}/done`, {}).then(response => {
      this.setState({ isDone: true });
    });
  }

  render() {
    return (
      <div className={styles.root}>
        <div class={styles.header}>
          <h2>OK! Here's what we need from you…</h2>
        </div>
        <div className={styles.files}>
          {this.state.files.map((file, index) => (
            <div className={styles.file}>
              <div className={styles.fileDetails}>
                <h2>
                  Picture {index + 1} - {file.type}
                </h2>
                <p>{file.notes}</p>
                {(file.previewURL || file.filename) && (
                  <div className={styles.image}>
                    <img src={file.filename ? getFileURL(file) : file.previewURL} />
                  </div>
                )}
                {!file.filename ? (
                  <div class={styles.upload}>
                    {file.previewURL && <h3>Happy with it? Hit Upload!</h3>}
                    <FileUpload
                      project={this.props.match.params.slug}
                      upload={file.slug}
                      onUploaded={this.onFileUploaded}
                      onPreview={this.onFilePreview}
                    />
                    {!file.previewURL && (
                      <div>
                        <p>Here's an example:</p>
                        <Thumbnail className={styles.preview} type={file.type} />
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Thanks!</p>
                )}
              </div>
            </div>
          ))}
        </div>
        {!this.state.hasEmail || this.state.isDone ? null : (
          <button className={styles.done} onClick={this.done}>
            I'm done!
          </button>
        )}
      </div>
    );
  }
}

module.exports = withRouter(Project);
