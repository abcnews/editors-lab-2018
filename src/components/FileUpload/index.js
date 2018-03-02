const { put } = require('axios');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

// const CONFIG = {
//   headers: {
//     'content-type': 'multipart/form-data'
//   }
// };

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFormSubmit(event) {
    event.preventDefault();

    const data = new FormData();

    data.append('file', event.target.querySelector('[type="file"]').files[0]);

    put(`/api/projects/${this.props.project}/uploads/${this.props.upload}`, data).then(response => {
      if (response.data.err) {
        return console.error(response.data.err);
      }

      if (this.props.onUploaded) {
        this.props.onUploaded({ slug: this.props.upload, data: response.data });
      }
    });
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
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
