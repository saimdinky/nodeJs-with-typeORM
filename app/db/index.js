const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ["models/*.entity.js"],
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
});

module.exports = { AppDataSource };
