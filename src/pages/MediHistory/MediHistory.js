import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import "./MediHistory.scss";

function MediHistory() {
  useEffect(() => {
    // document.querySelector("body").style.backgroundColor = "#fafafa";
  }, []);
  const handleClickClose = () => {
    document.querySelector("body").style.width = "360px";
    document.querySelector(".prescription-container").style.paddingRight = "0px";
    document.querySelector(".history-container").style.display = "none";
  };
  return (
    <div className="history-container">
      <div className="history-wrapper">
        <div className="d-flex mt-5">
          <FontAwesomeIcon icon={faCalendarWeek} />
          <h3>Medication History</h3>
        </div>
        <div className="history-list-item mt-5">
          <h4>Crestor 30Mg</h4>
          <p>3 tablets daily for 30 days Renewal in 20 days</p>
        </div>
        <div className="history-list-item mt-3">
          <h4>Crestor 30Mg</h4>
          <p>3 tablets daily for 30 days Renewal in 20 days</p>
        </div>
        <div className="history-list-item mt-3">
          <h4>Crestor 30Mg</h4>
          <p>3 tablets daily for 30 days Renewal in 20 days</p>
        </div>
        <Button type="submit" className="main-btn mt-5 close-btn" onClick={handleClickClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default MediHistory;
