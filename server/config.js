const Path = require('path');

let config = {
  DATABASE: `./server/${process.env.NODE_ENV}.sqlite`,
  UPLOAD_PATH: Path.resolve(__dirname, '../uploads')
};

if (process.env.NODE_ENV === 'test') {
  config.UPLOAD_PATH = '/tmp';
}

module.exports = config;
