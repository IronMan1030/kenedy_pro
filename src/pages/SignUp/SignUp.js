import React from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { Button } from "react-bootstrap";
import SignIn from "../SignIn/SignIn";
import { goBack, goTo, popToTop, Link, Router, getCurrent, getComponentStack } from "react-chrome-extension-router";
import "../SignIn/SignIn.scss";

function SignUp() {
  return (
    <div className="form-wrapper">
      <div className="logo-wrapper">
        <LogoIcon />
      </div>
      <h3>Kennedy</h3>
      <p>SignUp</p>
      <div className="form-block">
        <div className="input-block">
          <label>Full Name</label>
          <input type="text" placeholder="Joe" />
        </div>
        <div className="input-block">
          <label>Email</label>
          <input type="email" placeholder="Someone@example.com" />
        </div>
        <div className="input-block">
          <label>Password</label>
          <input type="password" placeholder="Password" />
        </div>
        <Button type="submit" className="main-btn">
          Signup
        </Button>
      </div>
      <Link component={SignIn}>
        <h6>Already have an Account?</h6>
      </Link>
    </div>
  );
}

export default SignUp;
