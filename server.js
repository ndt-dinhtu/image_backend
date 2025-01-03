const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(bodyParser.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
