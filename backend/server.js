const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const mongoose = require("mongoose");
const userRouter = require("./routes/user");

const startServer = async () => {
  const app = express();
  const port = process.env.PORT || 5000;
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use("/api/v1/user", userRouter);

  const uri = "mongodb+srv://admin:admin@cluster0.cv7fr.gcp.mongodb.net/kenedy?retryWrites=true&w=majority";

  await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(uri);
    });
  mongoose.set("useFindAndModify", false);
  app.listen(port, () => {
    console.log(`server is running on port:${port}`);
  });
};
startServer();
