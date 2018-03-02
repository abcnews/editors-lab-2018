const express = require('express');
const router = express.Router();
const db = require('./db');
const config = require('./config');

// Param helpers

router.param('project', async (request, response, next, slug) => {
  request.project = await db.findProject(slug);
  next();
});

router.param('upload', async (request, response, next, slug) => {
  request.upload = await db.findUpload(slug);
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
    return response.status(400).json({ err: 'No files were uploaded.' });
  }

  if (request.upload.projectId !== request.project.id) {
    return response.status(500).json({ err: 'That upload does not belong to the project' });
  }

  const file = request.files.file;
  const uploadFilename = `${request.upload.slug}-${file.name}`;
  const uploadPath = `${config.UPLOAD_PATH}/${uploadFilename}`;

  file.mv(uploadPath, async err => {
    if (err) {
      return response.status(500).json({ err });
    }

    // Save and refresh the upload
    db('uploads')
      .where({ id: request.upload.id })
      .update({ filename: uploadFilename });

    const upload = await db.findUpload(request.upload.slug);

    response.json(upload);
  });
});

module.exports = router;
