const sqlite3 = require('sqlite3');

const db = new Promise((resolve, reject) => {
  const conn = new sqlite3.Database('data.sqlite');

  conn.serialize(() => {
    conn.run(
      `
      CREATE TABLE IF NOT EXISTS upload(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt TEXT,
        updatedAt TEXT,
        slug TEXT,
        filename TEXT,
        FOREIGN KEY(projectid) REFERENCES project(id)
      )
      CREATE TABLE IF NOT EXISTS project(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt TEXT,
        updatedAt TEXT,
        slug TEXT,
        email TEXT
      )
      `,
      err => (err ? reject(err) : resolve(conn))
    );
  });
});

module.exports = db;
