const React = require('react');
const styles = require('./styles.scss');

class Input extends React.Component {
  render() {
    const { label, placeholder, type, help, textarea, value, autoFocus, onChange } = this.props;

    let input;
    if (textarea) {
      input = <textarea onChange={e => onChange(e.target.value)} value={value || ''} autoFocus={autoFocus} />;
    } else {
      input = (
        <input
          type={type}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          value={value || ''}
          autoFocus={autoFocus}
        />
      );
    }

    return (
      <span className={styles.root}>
        {label && <label>{label}</label>}
        {input}
        {help && <span className={styles.help}>{help}</span>}
      </span>
    );
  }
}

Input.defaultProps = {
  type: 'text',
  autoFocus: false,
  onChange: () => {}
};

module.exports = Input;
