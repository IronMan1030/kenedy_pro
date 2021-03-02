/*global chrome*/
import React, { useEffect } from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { MicIcon } from "../../assets/icons/MicIcon";
import { goTo } from "react-chrome-extension-router";
import Listening from "../Listening/Listening";

import "./MicBegin.scss";

function MicBegin() {
  useEffect(() => {
    document.querySelector("body").style.height = "200px";
  }, []);
  const handleClickMic = () => {
    chrome.runtime.sendMessage({ type: "startRecording" });
    goTo(Listening);
  };
  return (
    <div className="mic-wrapper">
      <div className="logo-wrapper">
        <LogoIcon />
      </div>
      <div className="d-flex mt-5">
        <div className="mic-btn" onClick={handleClickMic}>
          <MicIcon />
        </div>
        <h5>Top the mic to begin</h5>
      </div>
    </div>
  );
}

export default MicBegin;
