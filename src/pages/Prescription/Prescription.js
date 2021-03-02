import React from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { SmallMicIcon } from "../../assets/icons/SmallMicIcon";
import { MicIcon } from "../../assets/icons/MicIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Button } from "react-bootstrap";

import MediHistory from "../MediHistory/MediHistory";
import "./Prescription.scss";

function Prescription() {
  const handleClickHistory = () => {
    document.querySelector("body").style.width = "700px";
    document.querySelector(".history-container").style.display = "block";
    document.querySelector(".prescription-container").style.width = "337px";
    // document.querySelector(".prescription-container").style.paddingLeft = "23px";
    document.querySelector(".prescription-container").style.paddingRight = "23px";
    document.querySelector(".history-container").style.width = "360px";
  };
  return (
    <div className="d-flex">
      <div className="prescription-container">
        <div className="prescription-wrapper">
          <div className="logo-wrapper">
            <LogoIcon />
          </div>
          <div className="profile-block d-flex mt-5">
            <FontAwesomeIcon icon={faUser} />
            <div>
              <h5>John Adams</h5>
              <span>12-dec-1998(22 years) | male</span>
            </div>
          </div>
          <div className="history-block d-flex mt-3" onClick={handleClickHistory}>
            <FontAwesomeIcon icon={faCalendarWeek} />
            <h3>Medication History</h3>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          <h4 className="mt-3">New Prescription</h4>

          <div className="d-flex mt-3 prescription-item">
            <div>
              <label>Medication</label>
              <p>Amoxicillin 500mg</p>
            </div>
            <SmallMicIcon />
          </div>

          <div className="row">
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Duration(days)</label>
                  <p>60 days</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Quantity</label>
                  <p>3</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Refills</label>
                  <p>2</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <label>Substitutions</label>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Start Date</label>
                  <p>12 Dec 2020</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>End Date</label>
                  <p style={{ color: "#c7c7c7" }}>Unavailable</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
          </div>
          <div className="d-flex mt-3 prescription-item">
            <div>
              <label>instructions</label>
              <p style={{ color: "#c7c7c7" }}>Unavailable</p>
            </div>
            <SmallMicIcon />
          </div>
          <div className="d-flex mt-3 prescription-item">
            <div>
              <label>Notes</label>
              <p style={{ color: "#c7c7c7" }}>Unavailable</p>
            </div>
            <SmallMicIcon />
          </div>
          <h2 className="mt-3">Add another Prescription</h2>
          <Button type="submit" className="main-btn mt-3">
            Confirm
          </Button>
          <div className="mt-4 mb-3 d-inline-block">
            <MicIcon />
          </div>
        </div>
      </div>
      <MediHistory />
    </div>
  );
}

export default Prescription;
