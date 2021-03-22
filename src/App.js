/*global chrome*/
import React, { useState, useEffect } from "react";
import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SignIn from "./pages/SignIn/SignIn";
import MicBegin from "./pages/MicBegin/MicBegin";
import Listening from "./pages/Listening/Listening";
import Prescription from "./pages/Prescription/Prescription";
import MicPermission from "./pages/MicPermission/MicPermission";
import { Router } from "react-chrome-extension-router";
import axios from "axios";
import regeneratorRuntime from "regenerator-runtime";

function App() {
  const [isAuth, setIsAuth] = useState(false);
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

  useEffect(() => {
    const getProfileSession = async () => {
      let profile = await getObjectFromLocalStorage("profile");
      if (profile) {
        chrome.extension.getBackgroundPage().console.log(profile.userID);
        setIsAuth(true);
        try {
          const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/v1/user/check/${profile.userID}`;
          let response = await axios.get(apiUrl);
          chrome.extension.getBackgroundPage().console.log(`responseCode-app: ${response.data.responseCode}`);
          if (response.data.responseCode !== 1) {
            chrome.storage.local.clear();
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getProfileSession();
  }, []);

  // chrome.extension.getBackgroundPage().console.log(isAuth);
  return (
    <div className="App">
      <Router>{isAuth ? <MicPermission /> : <SignIn />}</Router>
      {/* <Router>
        <MicPermission />
      </Router> */}
    </div>
  );
}

export default App;
