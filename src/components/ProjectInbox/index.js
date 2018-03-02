const { get } = require('axios');
const React = require('react');
const Button = require('../Button');
const Input = require('../Input');
const Logo = require('../Logo');
const { CopyToClipboard } = require('react-copy-to-clipboard');

const { FILE_TYPES } = require('../../constants');
const { getFileURL } = require('../../utils');
const styles = require('./styles.scss');

class ProjectInbox extends React.Component {
  constructor(props) {
    super(props);

    this.onCopyLink = this.onCopyLink.bind(this);
    this.onWindowBlur = this.onWindowBlur.bind(this);
    this.pollForUpdates = this.pollForUpdates.bind(this);

    this.state = {
      files: [],
      isLinkCopied: false
    };

    // Dodgy hack - probably don't spam the server like this in subsequent prototypes.
    this._pollInterval = setInterval(this.pollForUpdates, 5000);
    this.pollForUpdates();

    window.addEventListener('blur', this.onWindowBlur);
  }

  pollForUpdates() {
    get(`/api/projects/${this.props.match.params.slug}`).then(response => {
      this.setState({ files: response.data.uploads });
    });
  }

  onCopyLink() {
    this.setState({ isLinkCopied: true });
  }

  onWindowBlur() {
    this.setState({ isLinkCopied: false });
  }

  componentWillUnmount() {
    clearInterval(this._pollInterval);
    window.removeEventListener('blur', this.onWindowBlur);
  }

  render() {
    const { files } = this.state;

    const uploadedFiles = files.filter(file => file.filename);
    const projectURL = `${window.location.toString().replace('/inbox', '')}`;

    return (
      <div className={styles.root}>
        <Logo />

        <div className={styles.files}>
          <h2>
            {uploadedFiles.length} of {files.length} pictures have been uploaded
          </h2>

          {uploadedFiles.length === 0 && (
            <div className={styles.project}>
              <p>
                <CopyToClipboard text={projectURL} onCopy={this.onCopyLink}>
                  <Input label="Share this URL with people for them to send you pictures" value={projectURL} readOnly />
                </CopyToClipboard>
                <CopyToClipboard text={projectURL} onCopy={this.onCopyLink}>
                  <div>
                    <Button label={this.state.isLinkCopied ? 'Copied! 👍' : 'Copy link'} />
                  </div>
                </CopyToClipboard>
              </p>
            </div>
          )}

          {uploadedFiles.length > 0 && <p>Click on them to download</p>}
          {uploadedFiles.map((file, index) => (
            <div className={styles.file}>
              <p>
                Photo {index + 1} - {file.type}
              </p>
              <a href={getFileURL(file)} download>
                <img src={getFileURL(file)} />
              </a>
            </div>
          ))}

          {uploadedFiles.length < files.length && (
            <div className={styles.remaining}>There is {files.length - uploadedFiles.length} left to be uploaded.</div>
          )}
        </div>
      </div>
    );
  }
}

module.exports = ProjectInbox;
