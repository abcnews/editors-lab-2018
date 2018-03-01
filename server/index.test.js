const server = require('.');
const request = require('supertest');
const db = require('./db');

beforeEach(async () => {
  await db('projects').truncate();
  await db('uploads').truncate();
});

describe('Server', () => {
  it('runs!', () => {
    return request(server)
      .get('/')
      .expect(200)
      .then(response => {
        expect(response.body).not.toBeNull();
      });
  });
});

describe('API', () => {
  it('creates a project', () => {
    return request(server)
      .post('/api/projects')
      .send({
        email: 'test@test.com',
        uploads: [
          {
            type: 'face',
            notes: 'Headshot'
          },
          {
            type: 'wide-shot',
            notes: 'A shot of the team'
          }
        ]
      })
      .expect(200)
      .then(response => {
        const project = response.body;

        expect(project.slug).not.toBeNull();
        expect(project.uploads).toBeInstanceOf(Array);
        expect(project.uploads.length).toBe(2);
        expect(project.uploads[0].type).toBe('face');
        expect(project.uploads[1].type).toBe('wide-shot');
      });
  });

  it('gets a project', async () => {
    const p = await db.createProject({
      email: 'test@test.com',
      uploads: [
        {
          type: 'face',
          notes: 'Headshot'
        },
        {
          type: 'wide-shot',
          notes: 'A shot of the team'
        }
      ]
    });

    return request(server)
      .get('/api/projects/' + p.slug)
      .expect(200)
      .then(response => {
        const project = response.body;

        expect(project.slug).not.toBeNull();
        expect(project.uploads).toBeInstanceOf(Array);
        expect(project.uploads.length).toBe(2);
        expect(project.uploads[0].type).toBe('face');
        expect(project.uploads[1].type).toBe('wide-shot');
      });
  });
});
