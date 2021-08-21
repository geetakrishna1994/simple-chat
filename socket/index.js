// Module imports
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import path from "path";
//router imports

import socketEventHandler from "./eventHandlers/socketHandler.js";
import dbEventHandler from "./eventHandlers/dbHandler.js";

import DbEvent from "./events/DbEvent.js";
import dbStream from "./events/dbStreams.js";

// initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

dotenv.config();
const MONGODB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.static("public"));

const userSocketMap = new Map();

const dbHandler = new DbEvent();

dbEventHandler(dbHandler, io, userSocketMap);

const listSocketIds = (m) => {
  for (let s of m) {
    console.log(s[1].id, s[1].connected, s[1].adapter.rooms, userSocketMap);
  }
};

io.on("connection", (socket) => {
  console.log(`socket connected : ${socket.id}`);
  socketEventHandler(socket, dbHandler);
  socket.on("message", (data) => console.log(data));
  socket.on("disconnect", () => {
    console.log("disconnected " + socket.user?._id);
    dbHandler.logout(socket.user?._id);
  });
});

// connect to db
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.once("connected", () => {
  console.log("connected to mongo db");
});

mongoose.connection.once("error", () => {
  console.log("error");
});

const db = mongoose.connection;

dbStream(db, dbHandler);

// listening
server.listen(PORT, () => {
  console.log(`listening for requests on port : ${PORT}`);
});
