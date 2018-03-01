const Path = require('path');
const express = require('express');
const router = express.Router();
const db = require('./db');

const UPLOAD_PATH = Path.resolve(__dirname, '../uploads');

// Param helpers

router.param('project', async (request, response, next, slug) => {
  const project = await db('projects')
    .where({ slug })
    .first();
  project.uploads = await db('uploads').where({ projectId: project.id });

  request.project = project;
  next();
});

router.param('upload', async (request, response, next, slug) => {
  request.upload = await db('uploads')
    .where({ slug })
    .first();
  next();
});

//

// Create a new project
router.post('/projects', async (request, response) => {
  const project = await db.createProject(request.body);
  response.json(project);
});

// Get a single project
router.get('/projects/:project', (request, response) => {
  if (!request.project) return response.status(404);
  response.json(request.project);
});

// Save an uploaded file
router.put('/projects/:project/uploads/:upload', (request, response) => {
  if (!request.files || !request.files.file) {
    return res.status(400).json({ err: 'No files were uploaded.' });
  }

  const file = request.files.file;
  const uploadFilename = `${request.upload.slug}-${file.name}`;
  const uploadPath = `${UPLOAD_PATH}/${uploadFilename}`;

  file.mv(uploadPath, err => {
    if (err) return res.status(500).json({ err });

    response.json(project);
  });
});

module.exports = router;
