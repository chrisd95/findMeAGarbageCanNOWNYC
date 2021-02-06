const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app = express();
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Listening on port... 5000");
});

// M E R N
// MONGODB
// E EXPRESS (ROUTAGE)            GOOGLE.COM/                GOOGLE.COM/IMAGES
// R REACT
// N NODE JS
