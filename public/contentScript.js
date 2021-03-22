/*global chrome*/
// let recorder;
let recordAudio;
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === "startRecordingFromContent") {
    console.log("start");
    startTranscription();
  } else if (request.message === "stopRecordingFromContent") {
    console.log("stop");
    recordAudio.stopRecording(function () {
      recordAudio.getDataURL(function (audioDataURL) {
        chrome.runtime.sendMessage({ type: "sendStream", data: audioDataURL });
      });
    });
  } else if (request.message === "requestAllowMic") {
    micPermission({ audio: true }, "Enabled Audio");
  } else if (request.message === "isPermission") {
    navigator.permissions.query({ name: "microphone" }).then(
      ({ state }) => chrome.runtime.sendMessage({ type: "resultPermission", data: state }),
      (e) => console.log(e.name + ": " + e.message)
    );
  }
  return true;
});

function micPermission(param, msg) {
  console.log(param);
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(param)
      .then(() => console.log(msg))
      .catch(() => {
        navigator.mediaDevices
          .getUserMedia(param)
          .then(() => console.log(msg))
          .catch(() => {
            navigator.mediaDevices
              .getUserMedia(param)
              .then(() => console.log(msg))
              .catch(() => {
                console.log("error");
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
