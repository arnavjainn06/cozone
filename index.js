const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const server = http.Server(app);

const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));
