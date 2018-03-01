const path = require('path');

const uploadsDir = path.resolve(__dirname, '../uploads');

module.exports = (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send(JSON.stringify({ err: 'No files were uploaded.' }));
  }

  const id = req.body.id;
  const file = req.files.file;
  const uploadFilename = `${id}-${file.name}`;
  const uploadPath = `${uploadsDir}/${uploadFilename}`;

  file.mv(uploadPath, err => {
    if (err) {
      return res.status(500).send(JSON.stringify({ err }));
    }

    res.send({ url: `/uploads/${uploadFilename}` });
  });
};
