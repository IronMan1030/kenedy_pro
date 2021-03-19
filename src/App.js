/*global chrome*/
import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SignIn from "./pages/SignIn/SignIn";
import MicBegin from "./pages/MicBegin/MicBegin";
import Listening from "./pages/Listening/Listening";
import Prescription from "./pages/Prescription/Prescription";

import * as ReactDOM from "react-dom";
import { Router } from "react-chrome-extension-router";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    // const { component, props } = getCurrent();
    // const components = getComponentStack();
    chrome.storage.local.get(["id_token"], function (result) {
      if (result.id_token) {
        setIsAuth(true);
      }
    });
  }, []);

  return (
    <div className="App">
      <Router>{isAuth ? <MicBegin /> : <SignIn />}</Router>
      {/* <Router>
        <MicBegin />
      </Router> */}
    </div>
  );
}

export default App;
