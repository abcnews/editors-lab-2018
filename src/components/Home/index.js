const { post } = require('axios');
const { h, Component } = require('preact');
const { route } = require('preact-router');
const { FILE_TYPES } = require('../../constants');
const styles = require('./styles.scss');

class Home extends Component {
  constructor(props) {
    super(props);

    this.addFile = this.addFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.create = this.create.bind(this);

    this.state = {
      email: '',
      files: []
    };
  }

  addFile(event) {
    this.setState({ files: this.state.files.concat([{ type: event.target.dataset.fileType }]) });
  }

  removeFile(event) {
    const index = +event.target.dataset.fileIndex;

    this.setState({
      files: this.state.files.reduce((memo, file, _index) => {
        if (index !== _index) {
          memo.push(file);
        }

        return memo;
      }, [])
    });
  }

  updateNotes(event) {
    const index = +event.target.dataset.fileIndex;
    const notes = event.target.value;

    this.setState({
      files: this.state.files.map((file, _index) => (index === _index ? { type: file.type, notes } : file))
    });
  }

  create() {
    post('/api/projects', {
      email: this.state.email,
      uploads: this.state.files
    }).then(response => {
      // console.log(response.data.slug);
      // this.setState({ projectSlug: response.data.slug });
      // console.log(response.data.slug, this.props.history);
      // window.location = `/inbox/${response.data.slug}`;
      route(`/inbox/${response.data.slug}`, true);
    });
  }

  render() {
    return (
      <div className={styles.root}>
        <h2>Create a project</h2>
        <p>
          Add details about the files you need, and hit the <strong>Create projct</strong> button
        </p>
        <div className={styles.files}>
          {this.state.files.map((file, index) => (
            <div className={styles.file}>
              {`File (type: ${FILE_TYPES[file.type]})`}
              <textarea data-file-index={index} onChange={this.updateNotes}>
                {file.notes || ''}
              </textarea>
              <button data-file-index={index} onClick={this.removeFile}>{`Remove file`}</button>
            </div>
          ))}
        </div>
        <div className={styles.types}>
          {Object.keys(FILE_TYPES).map(type => (
            <div className={styles.type}>
              <button data-file-type={type} onClick={this.addFile}>{`Add a "${FILE_TYPES[type]}" file`}</button>
            </div>
          ))}
        </div>
        {this.state.files.length > 0 && (
          <button className={styles.create} onClick={this.create}>
            Create project
          </button>
        )}
      </div>
    );
  }
}

// module.exports = withRouter(Home);
module.exports = Home;
