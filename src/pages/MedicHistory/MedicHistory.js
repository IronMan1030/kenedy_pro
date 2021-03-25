/*global chrome*/
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import "./MedicHistory.scss";
import regeneratorRuntime from "regenerator-runtime";
function MedicHistory({ history, onClickItem }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };

  const handleClickClose = () => {
    document.querySelector("body").style.width = "360px";
    document.querySelector(".prescription-container").style.paddingRight = "0px";
    document.querySelector(".history-container").style.display = "none";
    document.querySelector(".footer-wrapper").style.left = "74%";
  };
  const handleClickItem = (obj) => {
    onClickItem(obj);
  };
  return (
    <div className="history-container">
      <div className="history-wrapper">
        <div className="d-flex mt-5 mb-5">
          <FontAwesomeIcon icon={faCalendarWeek} />
          <h3>Medication History</h3>
        </div>
        {history &&
          history.map((obj, index) => {
            return (
              <div className="history-list-item mt-3" onClick={() => handleClickItem(obj.id)} key={index}>
                <h4>{obj.drug_name}</h4>
                <p>{obj.query}</p>
              </div>
            );
          })}

        <Button type="submit" className="main-btn mt-5 close-btn" onClick={handleClickClose}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default MedicHistory;
