/*global chrome*/
import React from "react";
import "./Footer.scss";
import AppLogo from "../../assets/images/logo.png";

function Footer() {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  // const manifestData = chrome.runtime.getManifest();
  return (
    <div className="float-right footer-wrapper">
      <img src={AppLogo} alt="app-logo" width={10} className="mr-1" />
      <span>{process.env.REACT_APP_NAME} </span>
      <span>{process.env.REACT_APP_VERSION_NAME}</span>
    </div>
  );
}

export default Footer;
