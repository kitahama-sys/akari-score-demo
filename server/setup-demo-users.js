import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function setupDemoUsers() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Check if users already exist
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (rows[0].count > 0) {
      console.log('Users already exist, skipping demo user creation');
      return;
    }

    // Create demo users
    const userPassword = await bcrypt.hash('DemoUser2024!', 10);
    const adminPassword = await bcrypt.hash('DemoAdmin2024!', 10);

    const users = [
      ['demo-user1', userPassword, 'デモユーザー1', 'local', 'user'],
      ['demo-user2', userPassword, 'デモユーザー2', 'local', 'user'],
      ['demo-user3', userPassword, 'デモユーザー3', 'local', 'user'],
      ['demo-admin', adminPassword, 'デモ管理者', 'local', 'admin']
    ];

    for (const [username, passwordHash, name, loginMethod, role] of users) {
      await connection.execute(
        'INSERT INTO users (username, passwordHash, name, loginMethod, role, createdAt, updatedAt, lastSignedIn) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
        [username, passwordHash, name, loginMethod, role]
      );
      console.log(`Created user: ${username}`);
    }

    console.log('Demo users created successfully!');
  } catch (error) {
    console.error('Error setting up demo users:', error);
  } finally {
    await connection.end();
  }
}

export { setupDemoUsers };
