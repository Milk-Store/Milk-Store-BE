const { Sequelize } = require('sequelize');
require('dotenv').config();
const db = require('../models');

const fixRefreshTokens = async () => {
  try {
    console.log('Connecting to the database...');
    // Kiểm tra kết nối database
    await db.sequelize.authenticate();
    console.log('Database connection successful.');

    // Truy vấn raw SQL để kiểm tra các bảng
    const [tables] = await db.sequelize.query(`
      SHOW TABLES LIKE 'refresh%';
    `);
    
    console.log('Found tables:', tables.map(t => Object.values(t)[0]));

    // Kiểm tra xem có bảng refresh_tokens hay không
    const hasRefreshTokensSnakeCase = tables.some(t => 
      Object.values(t)[0].toLowerCase() === 'refresh_tokens'
    );

    // Nếu tồn tại bảng refresh_tokens, xóa nó
    if (hasRefreshTokensSnakeCase) {
      console.log('Dropping table refresh_tokens...');
      await db.sequelize.query('DROP TABLE IF EXISTS refresh_tokens;');
      console.log('Table refresh_tokens dropped successfully.');
    } else {
      console.log('Table refresh_tokens does not exist, no need to drop.');
    }

    // Kiểm tra xem có bảng RefreshTokens (pascal case) hay không
    const hasRefreshTokensPascalCase = tables.some(t => 
      Object.values(t)[0] === 'RefreshTokens'
    );

    // Nếu tồn tại bảng RefreshTokens, xóa nó
    if (hasRefreshTokensPascalCase) {
      console.log('Dropping table RefreshTokens...');
      await db.sequelize.query('DROP TABLE IF EXISTS RefreshTokens;');
      console.log('Table RefreshTokens dropped successfully.');
    } else {
      console.log('Table RefreshTokens does not exist, no need to drop.');
    }

    // Hiển thị lại danh sách bảng sau khi xóa
    const [tablesAfter] = await db.sequelize.query(`
      SHOW TABLES LIKE 'refresh%';
    `);
    
    console.log('Tables after cleanup:', tablesAfter.map(t => Object.values(t)[0]));

    console.log('Refresh tokens fix completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Fix failed:', error);
    process.exit(1);
  }
};

// Chạy script
fixRefreshTokens(); 