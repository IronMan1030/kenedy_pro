/*global chrome*/
import React, { useState, useEffect } from "react";
import GoogleIcon from "../../assets/images/google_icon.png";
import { goTo } from "react-chrome-extension-router";
import MicBegin from "../MicBegin/MicBegin";
import MicPermission from "../MicPermission/MicPermission";
import Footer from "../../components/Footer/Footer";
import TopLogo from "../../components/TopLogo/TopLogo";
import axios from "axios";
import "./SignIn.scss";
import regeneratorRuntime from "regenerator-runtime";

function SignIn() {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    document.querySelector("body").style.height = "240px";
  }, []);

  const handleClickGmailLogin = async () => {
    try {
      chrome.runtime.sendMessage(
        { type: "gmail_login", clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID },
        async function (data) {
          if (data.result === 1) {
            try {
              let response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/user/login`, {
                token: data.data,
              });
              if (parseInt(response.data.responseCode) === 1) {
                chrome.storage.local.set({ profile: response.data.profile });
                goTo(MicPermission);
              } else {
                setErrorMsg(response.data.msg);
              }
            } catch (error) {
              setErrorMsg("Database failed!");
            }
          } else {
            setErrorMsg(data.msg);
          }
        }
      );
    } catch (error) {
      console.log(`${error}`);
    }
  };
  console.log(errorMsg);
  return (
    <div className="form-wrapper">
      <div className="logo-wrapper">
        <TopLogo />
      </div>
      <h3>Kennedy</h3>
      <div className="form-block">
        <div className="d-flex login-btn" onClick={handleClickGmailLogin}>
          <img src={GoogleIcon} alt="google-icon" width={30} height={30} />
          <span>Login with Google</span>
        </div>
      </div>
      <p>{errorMsg}</p>
      <Footer />
    </div>
  );
}

export default SignIn;
