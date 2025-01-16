const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const imageRoutes = require("./routes/imageRoutes");
const cors = require("cors");
const { exec } = require("child_process");
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(bodyParser.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/images", imageRoutes);
app.post("/open-folder", (req, res) => {
  const { folderPath } = req.body;
  if (!folderPath) {
    return res.status(400).send("Đường dẫn thư mục không hợp lệ");
  }

  const correctedPath = folderPath.replace(/\\/g, "/");

  exec(`start "" "${correctedPath}"`, (err) => {
    if (err) {
      res.status(500).send("Không thể mở thư mục");
    } else {
      res.send("Đã mở thư mục");
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
