const express = require('express');
const router = express.Router();
const MailgunJS = require('mailgun-js');
const db = require('./db');
const config = require('./config');

const HOSTNAME = 'getvision.online';

const MAILGUN_API_KEY = 'key-6e53568a9308f6cca4c07d2f02b33b87';
const MAILGUN_DOMAIN = HOSTNAME;
// const MAILGUN_DOMAIN = 'sandbox568f0172e4164f3da0ebab16f74ae431.mailgun.org';

const mailgun = MailgunJS({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

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
    await db('uploads')
      .where({ id: request.upload.id })
      .update({ filename: uploadFilename });

    const upload = await db.findUpload(request.upload.slug);

    response.json(upload);
  });
});

// Notify the project creator they should visit their inbox
router.post('/projects/:project/done', async (request, response) => {
  if (request.project.email) {
    const link = `${
      process.env.NODE_ENV === 'production' ? `https://${HOSTNAME}` : `http://localhost:${process.env.PORT || 9000}`
    }/${request.project.slug}/inbox`;

    mailgun.messages().send(
      {
        from: `Get Vision <notifications@${MAILGUN_DOMAIN}>`,
        to: request.project.email,
        subject: "You've got files!",
        text: `Check out your project inbox: ${link}`
      },
      (err, body) => {
        if (err) {
          return response.json({ err });
        }

        response.json({ status: 'Sent' });
      }
    );
  } else {
    response.json({ status: 'No email address to send to.' });
  }
});

module.exports = router;
