const React = require('react');
const styles = require('./styles.scss');

class Button extends React.Component {
  render() {
    const { clear, onClick, label } = this.props;

    return (
      <button className={`${styles.root} ${clear ? styles.clear : ''}`} onClick={onClick}>
        {label}
      </button>
    );
  }
}

module.exports = Button;
