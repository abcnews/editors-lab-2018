const { h, Component } = require('preact');

const IMAGES = {
  best: require('./best.jpg'),
  doing: require('./doing.jpg'),
  what: require('./what.jpg'),
  where: require('./where.jpg'),
  who: require('./who.jpg')
};

class Thumbnail extends Component {
  render() {
    return <img src={IMAGES[props.type]} />;
  }
}

module.exports = Thumbnail;
