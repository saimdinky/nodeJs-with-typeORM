require('dotenv').config({ path: 'app/.env' });
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['app/models/*.entity.js'],
  synchronize:
    process.env.NODE_ENV !== 'production' && process.env.DB_TYPE === 'mysql',
  logging: false,
});

module.exports = { AppDataSource };
