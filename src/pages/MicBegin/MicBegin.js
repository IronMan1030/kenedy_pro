/*global chrome*/
import React, { useState, useEffect } from "react";
import { MicIcon } from "../../assets/icons/MicIcon";
import { goTo } from "react-chrome-extension-router";
import Listening from "../Listening/Listening";
import MicPermission from "../MicPermission/MicPermission";
import Footer from "../../components/Footer/Footer";
import TopLogo from "../../components/TopLogo/TopLogo";
import regeneratorRuntime from "regenerator-runtime";
import "./MicBegin.scss";

function MicBegin({ isMicAllow }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  document.querySelector("body").style.height = "200px";
  const handleClickMic = () => {
    if (isMicAllow === 1) {
      chrome.storage.local.remove("pageStatus");
      //XXX change lastFocusedWindow to currentWindow
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
          console.log("MicBegin - handleClickMic - fail tabs.length check");
          return;
        }
        console.log("MicBegin - handleClickMic - tx - startRecordingFromContent");
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { message: "startRecordingFromContent" });
        return true;
      });
      goTo(Listening);
    } else {
      console.log("MicBegin - handleClickMic - not mic allowed");
    }
  };
  const handleClickToPermission = () => {
    goTo(MicPermission, { isClose: 1 });
  };
  // return (
  //   <div className="mic-wrapper">
  //     <div className="logo-wrapper">
  //       <LogoIcon />
  //     </div>
  //     {isMicAllow === 1 ? (
  //       <div className="d-flex mt-5">
  //         <div className="mic-btn" onClick={handleClickMic}>
  //           <MicIcon />
  //         </div>
  //         <h5>Click to listen</h5>
  //       </div>
  //     ) : (
  //       <div className="mt-4">
  //         <p>Please enable microphone permission for this tab.</p>
  //         <button type="button" className="btn btn-primary float-right" onClick={handleClickToPermission}>
  //           Close
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="mic-wrapper">
      <div className="logo-wrapper">
        <TopLogo />
      </div>
      <div className="d-flex mt-5">
        <div className="mic-btn" onClick={handleClickMic}>
          <MicIcon />
        </div>
        <h5>Click to listen</h5>
      </div>
      <Footer />
    </div>
  );
}

export default MicBegin;
