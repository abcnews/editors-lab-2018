const { put } = require('axios');
const React = require('react');
const Button = require('../Button');
const buttonStyles = require('../Button/styles.scss');
const styles = require('./styles.scss');

class FileUpload extends React.Component {
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
    const file = e.target.files[0];

    this.setState({ file });

    if (this.props.onPreview) {
      const reader = new FileReader();

      reader.onload = event => {
        this.props.onPreview({ slug: this.props.upload, data: { url: event.target.result } });
      };

      reader.readAsDataURL(file);
    }
  }

  render() {
    return (
      <form className={styles.root} onSubmit={this.onFormSubmit}>
        <label className={buttonStyles.root}>
          {`${this.state.file ? 'Change' : 'Add'} 📷`}
          <input type="file" onChange={this.onChange} />
        </label>
        {this.state.file && <Button submit primary label="Upload ⬆️" />}
      </form>
    );
  }
}

module.exports = FileUpload;
