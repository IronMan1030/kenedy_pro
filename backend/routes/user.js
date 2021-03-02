const router = require("express").Router();
let User = require("../models/user.model");
const axios = require("axios");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const speechConfig = sdk.SpeechConfig.fromSubscription("16870aa84024417ebeb0879c27535e85", "canadacentral");

router.post("/login", async (req, res) => {
  let userInfo = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${req.body.token}`);
  let userEmail = userInfo.data.email;
  const newUser = new User({
    email: userEmail,
  });
  let result = await User.find({ email: userEmail });
  if (!result.length) {
    try {
      await newUser.save();
    } catch (error) {
      res.status(400).json({ error: "databaseFailed" });
    }
  }
  res.json({ result: "success" });
});

router.post("/record", async (req, res) => {
  // let blobContent = req.body.stream;

  // const path = "./uploads/" + Date.now() + ".wav";
  // const base64Data = blobContent.replace("data:audio/webm;codecs=opus;base64,", "");
  // fs.writeFileSync(path, Buffer.from(base64Data, "base64"));

  fromFile();
});

function fromFile() {
  let pushStream = sdk.AudioInputStream.createPushStream();

  fs.createReadStream("./uploads/1.wav")
    .on("data", function (arrayBuffer) {
      console.log("arrayBuffer");
      pushStream.write(arrayBuffer.slice());
    })
    .on("end", function () {
      console.log("aaa");
      let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizer.recognizeOnceAsync((result) => {
        console.log(`RECOGNIZED: Text=${result.text}`);
        recognizer.close();
      });
      pushStream.close();
    });

  // let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  // let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
}

// router.post("/update", (req, res) => {
//   User.updateMany({ _id: req.body.id }, { $set: { type: req.body.type, monthly_rental: req.body.monthly_rental } })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });
module.exports = router;
