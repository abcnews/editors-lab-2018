const { get } = require('axios');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

class ProjectInbox extends Component {
  constructor(props) {
    super(props);

    this.onProject = this.onProject.bind(this);

    this.state = {
      files: []
    };

    const formData = new FormData();

    formData.append('slug', this.props.slug);

    get(VIEW_URL, formData).then(response => {
      this.setState({ files: response.data.files });
    });
  }

  onProject({ files }) {
    this.setState({ files });
  }

  render() {
    const hasAnyFileUploadsYet = this.status.files.some(file => file.url);

    return (
      <div className={styles.root}>
        {hasAnyFileUploadsYet && (
          <div className={styles.after}>
            <h2>Your project has been created!</h2>
            <p>Share this URL with people for them to submit files</p>
            <p>
              <code className={styles.projectURL}>{`${window.location}${slug}`}</code>
            </p>
          </div>
        )}
        <div className={styles.files}>
          {this.state.files.map(file => (
            <div className={styles.file}>
              {file.url ? <img src={file.url} /> : <FileUpload slug={file.slug} onUploaded={this.onFileUploaded} />}
            </div>
          ))}
          {this.state.files.map(file => (
            <div className={styles.file}>
              {`File (type: ${FILE_TYPES[file.type]})`}
              {file.url ? (
                <a href={file.url} download>
                  <img src={file.url} />
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
