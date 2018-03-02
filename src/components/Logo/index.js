const React = require('react');
const logoUrl = require('./logo.png');
const styles = require('./styles.scss');

class Logo extends React.Component {
  render() {
    return (
      <a href="/">
        <img src={logoUrl} className={styles.logo} />
      </a>
    );
  }
}

module.exports = Logo;
