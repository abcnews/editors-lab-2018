const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const create = require('./create');
const view = require('./view');
const upload = require('./upload');
const done = require('./done');
const inbox = require('./inbox');

const PORT = process.env.PORT || 9000;

const app = express();
const staticDir = path.resolve(__dirname, '../build');
const uploadsDir = path.resolve(__dirname, '../uploads');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(staticDir));
app.use('/uploads', express.static(uploadsDir));
app.use(fileUpload({ preserveExtension: true }));

app.post('/create', create);
app.get('/view', view);
app.post('/upload', upload);
app.post('/done', done);
app.get('/inbox', inbox);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticDir, 'index.html'));
});

http.createServer(app).listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
  console.log('http://localhost:' + PORT);
});
