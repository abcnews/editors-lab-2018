const React = require('react');

const IMAGES = {
  best: require('./best.jpg'),
  doing: require('./doing.jpg'),
  what: require('./what.jpg'),
  where: require('./where.jpg'),
  who: require('./who.jpg')
};

class Thumbnail extends React.Component {
  render() {
    return <img className={this.props.className} src={IMAGES[this.props.type]} />;
  }
}

Thumbnail.defaultProps = {
  className: '',
  type: 'who'
};

module.exports = Thumbnail;
