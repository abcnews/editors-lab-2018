const { post } = require('axios');
const { h, Component } = require('preact');
const { route } = require('preact-router');
const styles = require('./styles.scss');

const CREATE_URL = '/create';

const FILE_TYPES = {
  'photo-person': 'A photo of someone',
  'photo-object': 'A photo of something'
};

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
    const formData = new FormData();

    formData.append('email', this.state.email);

    this.state.files.forEach(file => {
      formData.append('file', JSON.stringify(file));
    });

    post(CREATE_URL, formData).then(response => {
      route(`/${response.data.slug}/inbox`);
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
        <button className={styles.create} onClick={this.create}>
          Create project
        </button>
      </div>
    );
  }
}

module.exports = Home;
