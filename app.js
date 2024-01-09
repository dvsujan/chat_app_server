const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth_routes");
const messageRoutes = require("./routes/message_routes");
const channelRoutes = require("./routes/channel_routes");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Bad Request" });
  }
  next(error);
});
require("dotenv").config();

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  console.log("received request"); 
  return res.json({
    message: "url shortening api",
  });
});

const DBURI = process.env.DBURI;

mongoose
  .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port, () => {
      console.log("[✓] connected to Database Successfully")
      console.log(`[✓] Started REST Services at port: ${port}`);
    });
  });

app.use('/auth', authRoutes); 
app.use('/message', messageRoutes);
app.use('/channel', channelRoutes);

module.exports = app;