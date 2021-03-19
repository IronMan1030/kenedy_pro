/*global chrome*/
import React, { useState, useEffect } from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import GoogleIcon from "../../assets/images/google_icon.png";
import { goTo } from "react-chrome-extension-router";
import MicBegin from "../MicBegin/MicBegin";
import axios from "axios";
import "./SignIn.scss";

function SignIn() {
  // const console = {
  //   log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  // };
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    document.querySelector("body").style.height = "240px";
    // chrome.tabs.executeScript({
    //   code: 'console.log("addd")',
    // });
  }, []);

  const handleClickGmailLogin = async () => {
    // try {
    //   chrome.runtime.sendMessage({ type: "gmail_login" }, async function (data) {
    //     let response = null;
    //     if (data.result === 1) {
    //       response = await axios.post("http://localhost:5000/api/v1/user/login", { token: data.data });
    //       response = response.data;
    //       response.result === "success" ? goTo(MicBegin) : setErrorMsg(response.error);
    //     } else {
    //       console.log(data.msg);
    //       setErrorMsg(data.msg);
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="form-wrapper">
      <div className="logo-wrapper">
        <LogoIcon />
      </div>
      <h3>Kennedy</h3>
      <div className="form-block">
        <div className="d-flex login-btn" onClick={handleClickGmailLogin}>
          <img src={GoogleIcon} alt="google-icon" width={30} height={30} />
          <span>Login with Google</span>
        </div>
      </div>
      <p>{errorMsg}</p>
    </div>
  );
}

export default SignIn;
