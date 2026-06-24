require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('./db'); // ملف تهيئة sqlite (أسفله)
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// serve static front-end
app.use(express.static(path.join(__dirname, 'public')));

// API: register
app.post('/api/register', async(req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    try {
        // check existing user
        const existing = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing) return res.status(409).json({ message: 'Username or email already taken' });

        const hashed = await bcrypt.hash(password, 10);
        const result = await db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hashed]);
        return res.status(201).json({ message: 'User created', id: result.lastID });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// API: login
app.post('/api/login', async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    try {
        const user = await db.get('SELECT id, username, password_hash FROM users WHERE username = ?', [username]);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        // For now return basic info. In production issue a session or JWT.
        return res.json({ id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }

});
// GET all courses
app.get('/api/courses', async(req, res) => {
    try {
        const courses = await db.all('SELECT id, title, description, image FROM courses ORDER BY id DESC', []);
        return res.json({ courses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// POST enroll (body: { username, courseId })
app.post('/api/enroll', async(req, res) => {
    const { username, courseId } = req.body;
    if (!username || !courseId) return res.status(400).json({ message: 'Missing fields' });

    try {
        // get user id
        const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // check course exists
        const course = await db.get('SELECT id FROM courses WHERE id = ?', [courseId]);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // insert enrollment (unique constraint will avoid duplicates)
        try {
            await db.run('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [user.id, courseId]);
            return res.json({ message: 'Enrolled successfully' });
        } catch (e) {
            // if unique constraint violated
            return res.status(409).json({ message: 'Already enrolled' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});
app.get('/api/is-admin', async(req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ isAdmin: false });
    try {
        const u = await db.get('SELECT is_admin FROM users WHERE username = ?', [username]);
        return res.json({ isAdmin: !!(u && u.is_admin === 1) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ isAdmin: false });
    }
});

// GET profile for a user (public/basic profile)
app.get('/api/profile', async(req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ message: 'Missing username' });
    try {
        const u = await db.get('SELECT username, display_name, avatar_url, bio FROM users WHERE username = ?', [username]);
        if (!u) return res.status(404).json({ message: 'User not found' });
        return res.json({ username: u.username, displayName: u.display_name || '', avatarUrl: u.avatar_url || '', bio: u.bio || '' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Update profile (basic, requires username in body)
app.put('/api/profile', async(req, res) => {
    const { username, displayName, avatarUrl, bio } = req.body;
    if (!username) return res.status(400).json({ message: 'Missing username' });
    try {
        const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await db.run('UPDATE users SET display_name = ?, avatar_url = ?, bio = ? WHERE username = ?', [displayName || '', avatarUrl || '', bio || '', username]);
        return res.json({ message: 'Profile updated' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Optional: get enrollments for a user
app.get('/api/my-enrollments', async(req, res) => {
    // expects query ?username=...
    const username = req.query.username;
    if (!username) return res.status(400).json({ message: 'Missing username' });

    try {
        const user = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const rows = await db.all(`
      SELECT c.id, c.title, c.description, c.image, e.enrolled_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `, [user.id]);

        return res.json({ enrollments: rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});
// helper to check admin (username -> boolean)
async function isUserAdmin(username) {
    if (!username) return false;
    try {
        const u = await db.get('SELECT is_admin FROM users WHERE username = ?', [username]);
        return !!(u && u.is_admin === 1);
    } catch (e) {
        return false;
    }
}

// Admin create course
app.post('/api/admin/course', async(req, res) => {
    const { username, title, description, image } = req.body;
    if (!username || !title) return res.status(400).json({ message: 'Missing fields' });

    if (!await isUserAdmin(username)) return res.status(403).json({ message: 'Forbidden' });

    try {
        const r = await db.run('INSERT INTO courses (title, description, image) VALUES (?, ?, ?)', [title, description || '', image || '']);
        return res.json({ message: 'Course created', id: r.lastID });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Admin update course
app.put('/api/admin/course/:id', async(req, res) => {
    const { username, title, description, image } = req.body;
    const id = req.params.id;
    if (!username || !id) return res.status(400).json({ message: 'Missing fields' });
    if (!await isUserAdmin(username)) return res.status(403).json({ message: 'Forbidden' });

    try {
        await db.run('UPDATE courses SET title = ?, description = ?, image = ? WHERE id = ?', [title, description, image, id]);
        return res.json({ message: 'Updated' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Admin delete course
app.delete('/api/admin/course/:id', async(req, res) => {
    const username = req.query.username;
    const id = req.params.id;
    if (!username || !id) return res.status(400).json({ message: 'Missing fields' });
    if (!await isUserAdmin(username)) return res.status(403).json({ message: 'Forbidden' });

    try {
        await db.run('DELETE FROM courses WHERE id = ?', [id]);
        return res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// fallback to index.html for single page:
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.listen(PORT, async() => {
    try {
        await db.init();
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error('Database initialization failed:', err);
        process.exit(1);
    }
});