const { get } = require('axios');
const React = require('react');
const { CopyToClipboard } = require('react-copy-to-clipboard');

const { FILE_TYPES } = require('../../constants');
const { getFileURL } = require('../../utils');
const styles = require('./styles.scss');

class ProjectInbox extends React.Component {
  constructor(props) {
    super(props);

    this.onCopyLink = this.onCopyLink.bind(this);

    this.state = {
      files: [],
      isLinkCopied: false
    };

    get(`/api/projects/${this.props.match.params.slug}`).then(response => {
      this.setState({ files: response.data.uploads });
    });
  }

  onCopyLink() {
    this.setState({ isLinkCopied: true });
  }

  render() {
    const hasAnyFileUploadsYet = this.state.files.some(file => file.filename);
    const projectURL = `${window.location.toString().replace('/inbox', '')}`;

    return (
      <div className={styles.root}>
        {!hasAnyFileUploadsYet && (
          <div className={styles.project}>
            <h2>Your project has been created!</h2>
            <p>Share this URL with people for them to submit files</p>
            <p>
              <code className={styles.projectURL}>{projectURL}</code>
              <CopyToClipboard text={projectURL} onCopy={this.onCopyLink}>
                <button className={styles.copy}>
                  {'Copy link'}
                  {this.state.isLinkCopied ? ' 👍' : null}
                </button>
              </CopyToClipboard>
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
