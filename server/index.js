const Path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 9000;

const app = express();

// Boilerplate
app.use(require('helmet')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ preserveExtension: true }));

// Serve files
app.use(express.static(Path.resolve(__dirname, '../build')));
app.use('/uploads', express.static(Path.resolve(__dirname, '../uploads')));

// Routes
app.use('/api', require('./routes'));
app.get('*', (request, response) => {
  response.sendFile(Path.resolve(__dirname, '../public/index.html'));
});

app.use((err, request, response, next) => {
  response.json({ err });
});

if (!module.parent) {
  // Start the game already!
  app.listen(PORT, () => {
    console.log(` 👍 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
