// db.js (نسخة محسّنة)
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// تأكد من وجود مجلد data
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

let dbPromise = open({
    filename: path.join(dataDir, 'database.sqlite'),
    driver: sqlite3.Database
});

module.exports = {
    get: async(sql, params = []) => {
        const db = await dbPromise;
        return db.get(sql, params);
    },
    all: async(sql, params = []) => {
        const db = await dbPromise;
        return db.all(sql, params);
    },
    run: async(sql, params = []) => {
        const db = await dbPromise;
        return db.run(sql, params);
    },
    init: async() => {
        const db = await dbPromise;

        // users table
        await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // add is_admin if missing
        const cols = await db.all("PRAGMA table_info(users)");
        const hasIsAdmin = cols.some(c => c.name === "is_admin");
        if (!hasIsAdmin) {
            await db.run("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0");
        }
        // add profile columns if missing
        const hasDisplay = cols.some(c => c.name === 'display_name');
        const hasAvatar = cols.some(c => c.name === 'avatar_url');
        const hasBio = cols.some(c => c.name === 'bio');
        if (!hasDisplay) {
            await db.run("ALTER TABLE users ADD COLUMN display_name TEXT");
        }
        if (!hasAvatar) {
            await db.run("ALTER TABLE users ADD COLUMN avatar_url TEXT");
        }
        if (!hasBio) {
            await db.run("ALTER TABLE users ADD COLUMN bio TEXT");
        }

        // courses
        await db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // enrollments
        await db.run(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
      )
    `);

        // seed courses if empty
        const row = await db.get("SELECT COUNT(1) AS cnt FROM courses");
        if (row && row.cnt === 0) {
            const sample = [
                ['Intro to Python', 'Basics of Python programming', 'https://via.placeholder.com/300x180?text=Python'],
                ['Web Development 101', 'HTML, CSS, JS fundamentals', 'https://via.placeholder.com/300x180?text=Web'],
                ['Data Science Basics', 'Intro to data analysis', 'https://via.placeholder.com/300x180?text=Data']
            ];
            for (const s of sample) {
                await db.run("INSERT INTO courses (title, description, image) VALUES (?, ?, ?)", s);
            }
        }
    }
};