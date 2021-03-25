/*global chrome*/
import React, { useState, useEffect } from "react";
import { goTo } from "react-chrome-extension-router";
import MicBegin from "../MicBegin/MicBegin";
import "./MicPermission.scss";
import MicPermissionLock from "../../assets/images/mic_permission_lock_pointer.png";
import Footer from "../../components/Footer/Footer";
import TopLogo from "../../components/TopLogo/TopLogo";
import regeneratorRuntime from "regenerator-runtime";

function MicPermission({ isClose }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  const [checked, setChecked] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [isClickBtn, setIsClickBtn] = useState(false);
  var intervalId = -1;
  var tabId = -1;

  chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.type === "resultPermission") {
      console.log(request.data);
      if (request && request.data === "granted") {
        if (intervalId > 0) {
          console.log("remove regular permission checks");
          clearInterval(intervalId);
        }
        chrome.extension.getBackgroundPage().console.log(request.data);
        setChecked(true);
        setIsDenied(false);
        document.querySelector("body").style.height = "300px";
        //XXX - uncomment
        console.log(`is clicked :${isClickBtn}`);
        if (!isClickBtn) {
          console.log(`is clicked--false :${isClickBtn}`);
          goTo(MicBegin, { isMicAllow: 1 });
        }
        //XXX uncomment -end
      } else if (request && request.data === "denied") {
        setIsDenied(true);
        document.querySelector("body").style.height = "400px";
      } else if (request && request.data === "prompt") {
        setIsDenied(false); //XXX added
        setChecked(false);
        document.querySelector("body").style.height = "240px";
      }
    }
  });

  function checkPermission() {
    console.log("checkPermission - tx - isPermission");
    chrome.tabs.sendMessage(tabId, { message: "isPermission" });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) {
      return;
    }
    const currentTab = tabs[0];
    chrome.tabs.sendMessage(currentTab.id, { message: "isPermission" });
    tabId = currentTab.id;
    intervalId = setInterval(checkPermission, 2000);
    return true;
  });

  useEffect(() => {
    // if (checked) {
    //   document.querySelector("body").style.height = "300px";
    // } else {
    //   document.querySelector("body").style.height = "240px";
    // }
    let isMounted = true;
    return () => {
      if (intervalId > 0) {
        console.log("remove interval function");
        isMounted = false;
        clearInterval(intervalId);
      }
      //setState({}); // This worked for me
    };
  }, []);

  const handleSwitchMicPermission = () => {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   if (!tabs.length) {
    //     return;
    //   }
    //   const currentTab = tabs[0];
    //   chrome.tabs.sendMessage(currentTab.id, { message: "isPermission" });
    //   return true;
    // });

    if (!checked) {
      setIsClickBtn(true);
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
  };

  const handleClickNext = () => {
    goTo(MicBegin, { isMicAllow: checked ? 1 : 0 });
  };
  return (
    <div className="permission-wrapper">
      <div className="logo-wrapper">
        <TopLogo />
      </div>
      {isDenied ? (
        <div className="denied-section">
          <p>We don't have permission to access your microphone</p>
          <div className="notice-wrapper">
            <img src={MicPermissionLock} alt="mic-permission-pointer" width={300} height={60} />
            <span className="d-block">
              You should be able to find a microphone icon at the end of your browser's address bar or a lock icon.
            </span>
            <span className="d-block mt-3">
              Click the recorder (or lock) icon on your address bar, choose "Always allow access to your microphone",
              then click "Done", and reload the page as instructed.
            </span>
          </div>
        </div>
      ) : (
        <>
          <p>We would like to access your microphone to continue.</p>
          <div className="d-flex justify-content-between mt-4">
            <div className="left-item">
              <span className="ml-2">Microphone</span>
            </div>
            <div className="right-item">
              <label className="mic-permission-switch">
                <input type="checkbox" onChange={handleSwitchMicPermission} checked={checked} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <button
            type="button"
            className={`btn btn-primary mt-4 ${checked ? "next-btn-show" : "next-btn-hide"}`}
            onClick={handleClickNext}
          >
            Continue
          </button>
        </>
      )}
      <Footer />
    </div>
  );
}

export default MicPermission;
