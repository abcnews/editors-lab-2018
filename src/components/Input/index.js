const React = require('react');
const styles = require('./styles.scss');

class Input extends React.Component {
  render() {
    const { label, placeholder, type, help, onChange } = this.props;

    return (
      <span className={styles.root}>
        {label && <label>{label}</label>}
        <input type={type} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        {help && <span className={styles.help}>{help}</span>}
      </span>
    );
  }
}

Input.defaultProps = {
  type: 'text',
  onChange: () => {}
};

module.exports = Input;
