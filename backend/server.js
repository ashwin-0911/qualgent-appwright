const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const jobs = require("./jobs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
const testUpload = multer({ dest: "tests/" });

app.post("/jobs", async (req, res) => {
  const job = await jobs.create(req.body);
  res.json(job);
});

app.get("/jobs/:id", async (req, res) => {
  const job = await jobs.find(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

app.get("/jobs", async (req, res) => {
  const all = await jobs.all();
  res.json(all);
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const fetch = await import("node-fetch").then(m => m.default);

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath), fileName);

  const response = await fetch("https://api-cloud.browserstack.com/app-automate/upload", {
    method: "POST",
    body: formData,
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}`).toString("base64")
    },
  });

  const data = await response.json();
  fs.unlinkSync(filePath);
  res.json({ app_url: data.app_url });
});

app.post("/upload-test", testUpload.single("file"), (req, res) => {
  const savedPath = `tests/${req.file.originalname}`;
  fs.renameSync(req.file.path, savedPath);
  res.json({ path: savedPath });
});

app.listen(8080, () => console.log("Backend running on http://localhost:8080"));
