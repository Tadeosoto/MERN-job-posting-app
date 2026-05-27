const express = require("express");
const app = express();
const routes = require("./routes/index");
const connectDB = require("./databaseConnection");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
const dotenv = require("dotenv");
dotenv.config();
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(limiter);
app.use("/api", routes);

connectDB();
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
const PORT = process.env.PORT || 3000;

// Local: npm run dev / npm start. Vercel: exporta la app como serverless.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
  });
}

module.exports = app;
