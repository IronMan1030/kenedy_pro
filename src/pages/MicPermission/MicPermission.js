/*global chrome*/
import React, { useState, useEffect } from "react";
import { SmallMicIcon } from "../../assets/icons/SmallMicIcon";
import { goTo } from "react-chrome-extension-router";
import MicBegin from "../MicBegin/MicBegin";
import "./MicPermission.scss";
import regeneratorRuntime from "regenerator-runtime";
function MicPermission({ isClose }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  const [checked, setChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.type === "resultPermission") {
      if (request && request.data === "granted") {
        chrome.extension.getBackgroundPage().console.log(request.data);
        setChecked(true);
        if (isClose !== 1) {
          goTo(MicBegin, { isMicAllow: 1 });
        }
      } else if (request && request.data === "denied") {
        setErrorMsg("Your microphone is denied. Please enable microphone in chrome.");
      } else {
        setChecked(false);
      }
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) {
      return;
    }
    const currentTab = tabs[0];
    chrome.tabs.sendMessage(currentTab.id, { message: "isPermission" });
    return true;
  });

  useEffect(() => {
    document.querySelector("body").style.height = "200px";
  }, []);

  const handleSwitchMicPermission = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        return;
      }
      const currentTab = tabs[0];
      chrome.tabs.sendMessage(currentTab.id, { message: "isPermission" });
      return true;
    });
    if (!checked) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
          return;
        }
        const currentTab = tabs[0];
        console.log(currentTab.id);
        chrome.tabs.sendMessage(currentTab.id, { message: "requestAllowMic" });
        return true;
      });
    }
    if (!errorMsg) {
      setChecked(!checked);
    }
  };

  const handleClickNext = () => {
    goTo(MicBegin, { isMicAllow: checked ? 1 : 0 });
  };
  return (
    <div className="permission-wrapper">
      {errorMsg ? <p>{errorMsg}</p> : <p>Please enable microphone permission to use this app</p>}
      <div className="d-flex justify-content-between mt-3">
        <div className="left-item">
          <SmallMicIcon />
          <span className="ml-2">Microphone</span>
        </div>
        <div className="right-item">
          <label className="mic-permission-switch">
            <input type="checkbox" onChange={handleSwitchMicPermission} checked={checked} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <button type="button" className="btn btn-primary mt-4 next-button" onClick={handleClickNext}>
        Next-test
      </button>
    </div>
  );
}

export default MicPermission;
