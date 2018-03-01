const { get, post } = require('axios');
const { h, Component } = require('preact');
const FileUpload = require('../FileUpload');
const styles = require('./styles.scss');

const DONE_URL = '/done';
const VIEW_URL = '/view';

class Project extends Component {
  constructor(props) {
    super(props);

    this.onProject = this.onProject.bind(this);
    this.onFileUploaded = this.onFileUploaded.bind(this);
    this.done = this.done.bind(this);

    this.state = {
      files: [
        {
          slug: 'test'
        }
      ],
      isDone: false
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

  onFileUploaded({ slug, data }) {
    this.setState({
      files: this.state.files.reduce((memo, file) => {
        if (file.slug === slug) {
          file.url = data.url;
        }

        memo.push(file);

        return memo;
      }, {})
    });
  }

  done() {
    post(DONE_URL, new FormData()).then(response => {
      // TODO: Thank you page?
    });

    this.setState({ isDone: true });
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.files}>
          {this.state.files.map(file => (
            <div className={styles.file}>
              {file.url ? <img src={file.url} /> : <FileUpload slug={file.slug} onUploaded={this.onFileUploaded} />}
            </div>
          ))}
        </div>
        {this.state.isDone ? null : (
          <button className={styles.done} onClick={this.done}>
            I'm done!
          </button>
        )}
      </div>
    );
  }
}

module.exports = Project;
