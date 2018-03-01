const Path = require('path');

let config = {
  DATABASE: `./server/database.sqlite`,
  UPLOAD_PATH: Path.resolve(__dirname, '../uploads')
};

if (process.env.NODE_ENV === 'test') {
  config.DATABASE = './server/test.sqlite';
  config.UPLOAD_PATH = '/tmp';
}

module.exports = config;
