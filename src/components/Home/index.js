const { post } = require('axios');
const React = require('react');
const { withRouter } = require('react-router');
const { FILE_TYPES } = require('../../constants');
const Button = require('../Button');
const Input = require('../Input');
const Thumbnail = require('../Thumbnail');
const smoothScroll = require('smoothscroll');
const styles = require('./styles.scss');
const Logo = require('../Logo');

class Home extends React.Component {
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

  addFile(type) {
    this.setState(state => {
      return {
        files: this.state.files.concat([{ type, notes: FILE_TYPES[type] }])
      };
    });
  }

  removeFile(index) {
    this.setState({
      files: this.state.files.reduce((memo, file, _index) => {
        if (index !== _index) {
          memo.push(file);
        }

        return memo;
      }, [])
    });
  }

  updateNotes(index, notes) {
    this.setState({
      files: this.state.files.map((file, _index) => (index === _index ? { type: file.type, notes } : file))
    });
  }

  create() {
    post('/api/projects', {
      email: this.state.email,
      uploads: this.state.files
    }).then(response => {
      this.props.history.push(`${response.data.slug}/inbox`);
    });
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h1>
            <Logo />
            Get Vision
          </h1>
          <p>Helping you get better pictures from local community members</p>
        </div>

        <div className={styles.email}>
          <Input
            type="email"
            onChange={email => this.setState({ email })}
            value={this.state.email}
            label="First up, what's your email address?"
            placeholder="Enter your email address..."
            help="This will be used to notify you when the files are ready."
          />
        </div>

        <div className={styles.pictures}>
          {this.state.files.length === 0 && <p>Ok, now add the kinds of photos that you need:</p>}

          <div className={styles.files}>
            {this.state.files.map((file, index) => (
              <div className={styles.file}>
                <div className={styles.fileDetails}>
                  <h2>
                    Picture {index + 1} - {file.type}
                  </h2>
                  <Input
                    label="Describe the photo that you want:"
                    textarea
                    onChange={notes => this.updateNotes(index, notes)}
                    value={file.notes || ''}
                    autoFocus
                  />
                  <p>Example for their reference:</p>
                  <Thumbnail className={styles.preview} type={file.type} />
                  <button className={styles.remove} onClick={e => this.removeFile(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.types}>
            {Object.keys(FILE_TYPES).map(type => (
              <button className={styles.addType} onClick={e => this.addFile(type)}>
                <Thumbnail className={styles.addPreview} type={type} />
                Add a "{type}" photo
              </button>
            ))}
          </div>
        </div>

        {this.state.files.length > 0 && (
          <div className={styles.done}>
            <p>
              When you're finished adding the photos you want then click here to create a link to send to your community
              member.
            </p>
            <Button className={styles.create} onClick={this.create} label="Create the link to send" />
          </div>
        )}
      </div>
    );
  }
}

module.exports = withRouter(Home);
