const { Sequelize } = require('sequelize');
require('dotenv').config();
const { createAdminUser } = require('../seeders/admin-user');
const db = require('../models');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');

const initializeDatabase = async () => {
  try {
    console.log('Connecting to the database...');
    
    // Kiểm tra kết nối database
    await db.sequelize.authenticate();
    console.log('Database connection successful.');

    console.log('Syncing database models...');
    // Đồng bộ hóa models với database (tạo bảng nếu chưa tồn tại)
    // Force: false - không xóa bảng đã tồn tại
    await db.sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');

    // Chạy migrations
    console.log('Running migrations...');
    try {
      await execPromise('npx sequelize-cli db:migrate');
      console.log('Migrations executed successfully.');
    } catch (migrateError) {
      console.error('Error running migrations:', migrateError.message);
    }

    // Chạy script fix-refresh-tokens để dọn dẹp bảng refresh_tokens trùng lặp
    console.log('Fixing refresh tokens table...');
    try {
      // Kiểm tra các bảng refresh tokens hiện có
      const [tables] = await db.sequelize.query(`
        SHOW TABLES LIKE 'refresh%';
      `);
      
      console.log('Found refresh tables:', tables.map(t => Object.values(t)[0]));

      // Nếu có bảng refresh_tokens, xóa nó
      const hasRefreshTokensSnakeCase = tables.some(t => 
        Object.values(t)[0].toLowerCase() === 'refresh_tokens'
      );

      if (hasRefreshTokensSnakeCase) {
        console.log('Dropping table refresh_tokens...');
        await db.sequelize.query('DROP TABLE IF EXISTS refresh_tokens;');
        console.log('Table refresh_tokens dropped successfully.');
      }

      // Nếu có bảng RefreshTokens (pascal case), xóa nó
      const hasRefreshTokensPascalCase = tables.some(t => 
        Object.values(t)[0] === 'RefreshTokens'
      );

      if (hasRefreshTokensPascalCase) {
        console.log('Dropping table RefreshTokens...');
        await db.sequelize.query('DROP TABLE IF EXISTS RefreshTokens;');
        console.log('Table RefreshTokens dropped successfully.');
      }

      // Đảm bảo bảng refreshtokens tồn tại
      if (!tables.some(t => Object.values(t)[0].toLowerCase() === 'refreshtokens')) {
        console.log('Creating table refreshtokens...');
        // Tái chạy migration cho refreshtokens
        await execPromise('npx sequelize-cli db:migrate');
      }
    } catch (fixError) {
      console.error('Error fixing refresh tokens:', fixError);
    }

    // Chạy seeders
    console.log('Running seeders...');
    try {
      await execPromise('npx sequelize-cli db:seed:all');
      console.log('Seeders executed successfully.');
    } catch (seedError) {
      console.log('Note: Some seeders may have been skipped if data already exists.');
    }

    // Tạo tài khoản admin mặc định
    console.log('Creating admin user if not exists...');
    await createAdminUser();

    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Chạy script
initializeDatabase(); 