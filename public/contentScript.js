/*global chrome*/
// let recorder;
let recordAudio;
let mediaStream;
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === "startRecordingFromContent") {
    console.log("start");
    startTranscription();
  } else if (request.message === "stopRecordingFromContent") {
    console.log("stop");

    if (recordAudio) {
      recordAudio.stopRecording(function () {
        recordAudio.getDataURL(function (audioDataURL) {
          chrome.runtime.sendMessage({ type: "sendStream", data: audioDataURL });
        });
      });
    }
    if (mediaStream) {
      //removes recording indicator on windows
      mediaStream.stop();
      if (mediaStream.getAudioTracks()) {
        // removes recording indicator on chrome
        mediaStream.getAudioTracks()[0].stop();
      }
    }
  } else if (request.message === "requestAllowMic") {
    console.log("requestAllowMic - call micPermission()");
    micPermission({ audio: true }, "Enabled Audio");
  } else if (request.message === "isPermission") {
    navigator.permissions.query({ name: "microphone" }).then(({ state }) => {
      console.log("isPermission - tx - resultPermission: " + state);
      chrome.runtime.sendMessage({ type: "resultPermission", data: state });
    });
  }
  return true;
});

function micPermission(param, msg) {
  console.log(param);
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(param)
      .then(() => {
        console.log("micPermission " + msg);
      })
      .catch(() => {
        navigator.mediaDevices
          .getUserMedia(param)
          .then(() => console.log(msg))
          .catch(() => {
            navigator.mediaDevices
              .getUserMedia(param)
              .then(() => console.log(msg))
              .catch(() => {
                console.log("micPermission - tx - resultPermission: denied");
                chrome.runtime.sendMessage({ type: "resultPermission", data: "denied" });
              });
          });
      });
  }
}

function startTranscription() {
  navigator.getUserMedia(
    {
      audio: true,
    },
    function (stream) {
      mediaStream = stream;
      recordAudio = RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",
        sampleRate: 44100,
        desiredSampRate: 16000,
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
        checkForInactiveTracks: false,
      });
      recordAudio.startRecording();
    },
    function (error) {
      console.error(JSON.stringify(error));
    }
  );
}
