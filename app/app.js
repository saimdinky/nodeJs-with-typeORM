require("reflect-metadata");
require("dotenv").config();
const express = require("express");
const { authorizer } = require("./auth/middleware");
const { AppDataSource } = require("./db/index");
const { logger: log } = require("./utils/log/index");

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());
app.use(require("morgan")("dev"));
app.use(require("body-parser").json());

// Route setup
app.use(authorizer);
app.use("/api", require("./routes/index"));

// Test route
app.get("/test", (req, res) => {
  res.status(200).send("Application Started");
});

// Catch-all route for invalid endpoints
app.use("*", (req, res, next) => {
  try {
    return res.status(404).json({
      message: "Invalid Route",
    });
  } catch (error) {
    next(error);
  }
});

// Error handler

// Async function to initialize database and start server
async function startServer() {
  try {
    // Initialize TypeORM DataSource
    await AppDataSource.initialize();
    log.info("✅ Database connection established");

    // Start the server only after successful DB connection
    app.listen(3000, () => {
      log.info("✅ Server Listening on port 3000");
    });
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    process.exit(1); // Exit process if DB connection fails
  }
}

// Start the application
startServer();
