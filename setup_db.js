const db = require('./db');

async function setupDatabase() {
    try {
        console.log('Initializing database...');
        await db.init();
        console.log('✓ Database initialized successfully');
        process.exit(0);
    } catch (err) {
        console.error('✗ Database setup failed:', err.message);
        process.exit(1);
    }
}

setupDatabase();