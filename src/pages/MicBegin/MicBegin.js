/*global chrome*/
import React, { useState, useEffect } from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { MicIcon } from "../../assets/icons/MicIcon";
import { goTo } from "react-chrome-extension-router";
import Listening from "../Listening/Listening";
import MicPermission from "../MicPermission/MicPermission";
import regeneratorRuntime from "regenerator-runtime";
import "./MicBegin.scss";

function MicBegin({ isMicAllow }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };

  useEffect(() => {
    document.querySelector("body").style.height = "200px";
  }, []);

  const handleClickMic = () => {
    if (isMicAllow === 1) {
      chrome.storage.local.remove("pageStatus");
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (!tabs.length) {
          return;
        }
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { message: "startRecordingFromContent" });
        return true;
      });
      goTo(Listening);
    }
  };
  const handleClickToPermission = () => {
    goTo(MicPermission, { isClose: 1 });
  };
  return (
    <div className="mic-wrapper">
      <div className="logo-wrapper">
        <LogoIcon />
      </div>
      {isMicAllow === 1 ? (
        <div className="d-flex mt-5">
          <div className="mic-btn" onClick={handleClickMic}>
            <MicIcon />
          </div>
          <h5>Click to listen</h5>
        </div>
      ) : (
        <div className="mt-4">
          <p>Please enable microphone permission for this tab.</p>
          <button type="button" className="btn btn-primary float-right" onClick={handleClickToPermission}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default MicBegin;
