const { post } = require('axios');
const React = require('react');
const { withRouter } = require('react-router');
const { FILE_TYPES } = require('../../constants');
const Button = require('../Button');
const Input = require('../Input');
const styles = require('./styles.scss');
const logoUrl = require('./logo.png');

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
            <img src={logoUrl} className={styles.logo} />
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
          <p>Ok, now describe the kinds of photos that you need:</p>

          <div className={styles.files}>
            {this.state.files.map((file, index) => (
              <div className={styles.file}>
                <h2>Picture {index + 1}</h2>
                <p>[Example {file.type} image...]</p>
                <textarea onChange={e => this.updateNotes(index, e.target.value)} value={file.notes || ''} />
                <button onClick={e => this.removeFile(index)}>{`Remove file`}</button>
              </div>
            ))}
          </div>

          <div className={styles.types}>
            {Object.keys(FILE_TYPES).map(type => (
              <div className={styles.type}>
                <button onClick={e => this.addFile(type)}>{`Add a "${FILE_TYPES[type]}" file`}</button>
              </div>
            ))}
          </div>
        </div>
        {this.state.files.length > 0 && (
          <div className={styles.done}>
            <Button className={styles.create} onClick={this.create} label="Create project" />
          </div>
        )}
      </div>
    );
  }
}

module.exports = withRouter(Home);
