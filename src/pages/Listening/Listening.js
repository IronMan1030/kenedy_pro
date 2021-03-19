/*global chrome*/
import React, { useState, useEffect } from "react";
// import { ListeningIcon } from "../../assets/icons/ListeningIcon";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import ListeningIcon from "../../assets/images/listening_icon.png";
// import MicBegin from "../MicBegin/MicBegin";
import { goBack } from "react-chrome-extension-router";
import axios from "axios";
import "./Listening.scss";

function Listening() {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  useEffect(() => {
    document.querySelector("body").style.height = "300px";
  }, []);

  const handleClickStopRecording = async () => {
    chrome.runtime.sendMessage({ type: "stopRecording" });
    // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //   if (request.type === "sendingAudio") {
    //     console.log(request.data);
    //     let res = axios.post("http://52.60.65.17/api/v1/user/record", { stream: request.data });
    //     console.log(res.data);
    //   }
    // });
    // goBack();
  };

  return (
    <div className="listening-wrapper mb-3">
      <div className="logo-wrapper">
        <LogoIcon />
      </div>
      <h3>Listening...</h3>
      <div className="mt-5">
        <img src={ListeningIcon} alt="ListeningIcon" width="90" height="90" onClick={handleClickStopRecording} />
      </div>
    </div>
  );
}

export default Listening;
