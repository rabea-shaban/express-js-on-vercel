const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const app = express();
const path = require("path");

// Middlewares

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://front-e-commerce-v2.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

// Static files
app.use("/uploads", express.static("src/uploads"));

//* Router
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/auth", authRoutes);

module.exports = app;
