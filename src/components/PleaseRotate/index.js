const React = require('react');
const Logo = require('../Logo');
const styles = require('./styles.scss');

function shouldRotate() {
  return window.innerWidth < 780 && Math.max(window.innerWidth, window.innerHeight) === window.innerHeight;
}

class PleaseRotate extends React.Component {
  constructor(props) {
    super(props);

    this.onOrientationChange = this.onOrientationChange.bind(this);

    this.state = {
      needsToRotate: shouldRotate()
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onOrientationChange);
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onOrientationChange);
    window.removeEventListener('orientationchange', this.onOrientationChange);
  }

  onOrientationChange() {
    this.setState(state => ({ needsToRotate: shouldRotate() }));
  }

  render() {
    if (this.state.needsToRotate) {
      return (
        <div className={styles.message}>
          <Logo />
          <p>Please have your phone side-on when taking photos.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

module.exports = PleaseRotate;
