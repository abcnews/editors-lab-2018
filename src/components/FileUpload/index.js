const { post } = require('axios');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

const URL = '/upload';
const CONFIG = {
  headers: {
    'content-type': 'multipart/form-data'
  }
};

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();

    this.fileUpload(this.state.file).then(response => {
      if (this.props.onUploaded) {
        this.props.onUploaded(response.data);
      }
    });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  fileUpload(file) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('id', this.props.id);

    return post(URL, formData, CONFIG);
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

module.exports = FileUpload;
