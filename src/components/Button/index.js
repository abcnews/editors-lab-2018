const React = require('react');
const styles = require('./styles.scss');

class Button extends React.Component {
  render() {
    const { clear, primary, onClick, label, submit } = this.props;

    return (
      <button
        className={`${styles.root} ${clear ? styles.clear : ''} ${primary ? styles.primary : ''}`}
        type={submit ? 'submit' : null}
        onClick={onClick}
      >
        {label}
      </button>
    );
  }
}

module.exports = Button;
