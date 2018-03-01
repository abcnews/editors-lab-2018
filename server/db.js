const sqlite3 = require('sqlite3');
const Gimmea = require('gimmea');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: `./server/${process.env.NODE_ENV}.sqlite`
  },
  useNullAsDefault: true
});

module.exports = knex;

module.exports.createProject = async body => {
  const now = new Date();

  // Insert project -> SQLite returns the new ID from an insert
  const projectId = (await knex('projects').insert({
    email: body.email,
    slug: Gimmea.hash(null, 6),
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
  const project = await knex('projects')
    .where({ id: projectId })
    .first();
  project.uploads = await knex('uploads').where({ projectId });

  return project;
};
