const { put } = require('axios');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

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

    this.fileUpload().then(response => {
      if (this.props.onUploaded) {
        this.props.onUploaded({ slug: this.props.upload, data: response.data });
      }
    });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  fileUpload() {
    const formData = new FormData();

    formData.append('file', this.state.file);

    return put(`/api/projects/${this.props.project}/uploads/${this.props.uploads}`, formData, CONFIG);
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
