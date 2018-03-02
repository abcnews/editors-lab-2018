const { UPLOADS_ROOT } = require('./constants');

module.exports.getFileURL = file => `${UPLOADS_ROOT}${file.slug}-${file.filename}`;
