/*global chrome*/
import React, { useState, useEffect } from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { MicIcon } from "../../assets/icons/MicIcon";
import StopListeningIcon from "../../assets/images/stop_listening_icon.png";
import Prescription from "../Prescription/Prescription";
import { goTo } from "react-chrome-extension-router";
import axios from "axios";
import "./Listening.scss";
import MicBegin from "../MicBegin/MicBegin";
import regeneratorRuntime from "regenerator-runtime";

const getObjectFromLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};
let userProfile = "";
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type === "sendStream") {
    chrome.extension.getBackgroundPage().console.log("socket connecting!!!");
    userProfile = await getObjectFromLocalStorage("profile");
    saveAudio(request.data);
  }
});

const saveAudio = async (param) => {
  let config = {
    headers: { Authorization: `Bearer ${userProfile.jwt}` },
  };
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/v1/user/record`;
  let response = await axios.post(
    apiUrl,
    {
      base64Content: param,
      userID: userProfile.userID,
    },
    config
  );

  if (response.data.responseCode === 1) {
    const luisEntities = response.data.result.prediction.entities;

    let drugNameFromLuis = "";
    let drugDosageFromLuis = "";
    let drugSizeFromLuis = "";
    let drugDurationFromLuis = "";
    let drugInstructionsFromLuis = "";
    let drugRepeatFromLuis = "";
    let patientNameFromLuis = "";
    let audioName = "";
    let queryFromLuis = "";

    if (response.data.result) {
      audioName = response.data.result.audioName;
    }

    if (response.data.result.query) {
      queryFromLuis = response.data.result.query;
    }
    if (luisEntities.drugName) {
      drugNameFromLuis = luisEntities.drugName[0][0];
    }
    if (luisEntities.drugSize) {
      drugSizeFromLuis = luisEntities.drugSize[0];
    }
    // if (luisEntities.datetimeV2 && luisEntities.datetimeV2[0].type === "timerange") {
    //   luisDateTime = luisEntities.datetimeV2[0].values[0].resolution[0];
    // }
    if (luisEntities.drugInstructions) {
      drugInstructionsFromLuis = luisEntities.drugInstructions[0];
    }
    if (luisEntities.drugDosage) {
      drugDosageFromLuis = luisEntities.drugDosage[0];
    }
    if (luisEntities.drugDuration) {
      drugDurationFromLuis = luisEntities.drugDuration[0];
    }
    // if (luisEntities.drugTotal) {
    //   luisRefills = luisEntities.drugTotal[0];
    // }
    if (luisEntities.drugRepeat) {
      drugRepeatFromLuis = luisEntities.drugRepeat[0];
    }
    if (luisEntities.patientName) {
      patientNameFromLuis = luisEntities.patientName[0];
    }

    let prescriptionData = JSON.stringify({
      drugName: drugNameFromLuis,
      drugDosage: drugDosageFromLuis,
      drugSize: drugSizeFromLuis,
      drugDuration: drugDurationFromLuis,
      drugInstructions: drugInstructionsFromLuis,
      drugRepeat: drugRepeatFromLuis,
      patientName: patientNameFromLuis,
      note: "",
      query: queryFromLuis,
      audioName: audioName,
    });
    chrome.extension.getBackgroundPage().console.log(`prescription: ${JSON.stringify(prescriptionData)}`);
    goTo(Prescription, { prescriptionData });
  } else {
    goTo(MicBegin, { isMicAllow: 1 });
  }
};

function Listening({ toListening }) {
  // const console = {
  //   log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  // };
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    document.querySelector("body").style.height = "310px";
    if (toListening === 1) {
      startRecording();
    }
  }, [toListening]);

  const handleClickStopRecording = async () => {
    if (isListening) {
      setIsListening(false);
      startRecording();
    } else {
      setIsListening(true);
      stopRecording();
    }
  };
  const startRecording = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        return;
      }
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, { message: "startRecordingFromContent" });
      return true;
    });
  };
  const stopRecording = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        return;
      }
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, { message: "stopRecordingFromContent" });
      return true;
    });
  };

  return (
    <div className="listening-wrapper mb-3">
      <div className="logo-wrapper">
        <LogoIcon />
      </div>
      <h3>{isListening ? "Processing" : "Click to stop"}</h3>
      <div className="mt-5 mb-3">
        {isListening ? (
          <div>
            <MicIcon />
          </div>
        ) : (
          <img src={StopListeningIcon} alt="ListeningIcon" width="90" height="90" onClick={handleClickStopRecording} />
        )}
      </div>
    </div>
  );
}

export default Listening;
