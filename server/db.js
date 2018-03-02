const sqlite3 = require('sqlite3');
const Gimmea = require('gimmea');
const config = require('./config');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: config.DATABASE
  },
  useNullAsDefault: true
});

const createProject = async body => {
  const now = new Date();
  const slug = Gimmea.hash(null, 6);

  // Insert project -> SQLite returns the new ID from an insert
  const projectId = (await knex('projects').insert({
    email: body.email,
    slug,
    createdAt: now,
    updatedAt: now
  }))[0];

  // Insert all of the empty uploads
  await Promise.all(
    body.uploads.map(upload => {
      upload.projectId = projectId;
      upload.slug = Gimmea.hash(null, 6);
      upload.createdAt = now;
      upload.updatedAt = now;
      return knex('uploads').insert(upload);
    })
  );

  // Retreive the stuff we just saved and piece it back together
  return await findProject(slug);
};

const findProject = async slug => {
  const project = await knex('projects')
    .where({ slug })
    .first();

  if (project) {
    project.uploads = await knex('uploads').where({ projectId: project.id });
  }

  return project;
};

const findUpload = async slug => {
  const upload = await knex('uploads')
    .where({ slug })
    .first();

  return upload;
};

module.exports = knex;
module.exports.createProject = createProject;
module.exports.findProject = findProject;
module.exports.findUpload = findUpload;
