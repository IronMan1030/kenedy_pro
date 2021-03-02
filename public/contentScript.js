/*global chrome*/
let recorder;
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.message === "startRecording") {
    console.log("start");
    recorder = await recordAudio();
    recorder.start();
  } else if (request.message === "stopRecording") {
    const audio = await recorder.stop();
    audio.play();
    let blobFile = audio.audioChunks[0];
    let reader = new window.FileReader();
    reader.readAsDataURL(blobFile);
    reader.onloadend = function () {
      base64data = reader.result;
      chrome.runtime.sendMessage({ type: "sendingAudio", data: base64data });
    };
  }
  return true;
});

const recordAudio = () => {
  return new Promise((resolve) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      const start = () => {
        mediaRecorder.start();
      };

      const stop = () => {
        return new Promise((resolve) => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => {
              audio.play();
            };

            resolve({ audioBlob, audioUrl, play, audioChunks });
          });

          mediaRecorder.stop();
        });
      };

      resolve({ start, stop });
    });
  });
};
