/*global chrome*/
import React, { useState, useEffect } from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { SmallMicIcon } from "../../assets/icons/SmallMicIcon";
import { MicIcon } from "../../assets/icons/MicIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Button } from "react-bootstrap";
import axios from "axios";
import MedicHistory from "../MedicHistory/MedicHistory";
import Listening from "../Listening/Listening";
import RecordItem from "../../components/RecordItem/RecordItem";
import { v4 as uuidv4 } from "uuid";
import "./Prescription.scss";
import { goTo } from "react-chrome-extension-router";
import { getCurrentDate, getDateFromDuration } from "../../utils";
import regeneratorRuntime from "regenerator-runtime";
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

function Prescription({ prescriptionData }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };

  const [checked, setChecked] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [propsData, setPropsData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [cartList, setCartList] = useState([]);
  const [history, setHistory] = useState([]);

  const handleClickHistory = () => {
    document.querySelector("body").style.width = "700px";
    document.querySelector(".history-container").style.display = "block";
    document.querySelector(".prescription-container").style.width = "337px";
    document.querySelector(".prescription-container").style.paddingRight = "23px";
    document.querySelector(".history-container").style.width = "360px";
  };

  useEffect(() => {
    if (prescriptionData) {
      let jsonData = JSON.parse(prescriptionData);
      if (jsonData.drugDuration) {
        setStartDate(getCurrentDate());
        setEndDate(getDateFromDuration(jsonData.drugDuration));
      }
      setPropsData(jsonData);
    }
    const getRecordingInCart = async () => {
      let userInfoFromSession = await getObjectFromLocalStorage("profile");
      setUserInfo(userInfoFromSession);
      setHistory(await getRecordingData(userInfoFromSession.jwt, false));
      setCartList(await getRecordingData(userInfoFromSession.jwt, true));
    };
    getRecordingInCart();
  }, [prescriptionData]);

  const getRecordingData = async (token, isForCart) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/prescription/get`,
        { prescription_status: isForCart ? 2 : 1 },
        config
      );

      if (response.data.responseCode === 1) {
        return response.data.result;
      }
    } catch (error) {
      console.log(`prescription:${error}`);
      return [];
    }
  };

  const handleSwitchSubstitution = () => {
    setChecked(!checked);
  };

  const handleClickConfirm = async () => {
    let config = {
      headers: { Authorization: `Bearer ${userInfo.jwt}` },
    };
    let cartID = uuidv4();
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/prescription/update`,
        {
          cartList: cartList,
          cartID: cartID,
          confirmList: {
            user_id: userInfo.userID,
            user_email: userInfo.email,
            cart_id: cartID,
            query: propsData.query,
            drug_name: propsData.drugName,
            drug_dosage: propsData.drugDosage,
            drug_size: propsData.drugSize,
            drug_duration: propsData.drugDuration,
            drug_instructions: propsData.drugInstructions,
            start_date: startDate,
            end_date: endDate,
            drug_repeat: propsData.drugRepeat,
            patient_name: propsData.patientName,
            note: propsData.note,
            prescription_status: 1,
            audio_name: propsData.audioName,
          },
        },
        config
      );
      console.log(JSON.stringify(propsData));
      let clearPropsData = [{ patientName: propsData.patientName }];
      setCartList([]);
      setPropsData(clearPropsData);
      setHistory(await getRecordingData(userInfo.jwt, false));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickItem = (itemInfo) => {
    setPropsData(itemInfo);
  };

  const handleClickListening = () => {
    goTo(Listening, { toListening: 1 }); //from new prescription
  };

  const handleClickAnotherPrescription = async () => {
    let config = {
      headers: { Authorization: `Bearer ${userInfo.jwt}` },
    };
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/prescription/save`,
        {
          prescription: {
            user_id: userInfo.userID,
            user_email: userInfo.email,
            cart_id: "",
            query: propsData.query,
            drug_name: propsData.drugName,
            drug_dosage: propsData.drugDosage,
            drug_size: propsData.drugSize,
            drug_duration: propsData.drugDuration,
            drug_instructions: propsData.drugInstructions,
            start_date: startDate,
            end_date: endDate,
            drug_repeat: propsData.drugRepeat,
            patient_name: propsData.patientName,
            note: propsData.note,
            prescription_status: 2,
            audio_name: propsData.audioName,
          },
        },
        config
      );
      if (response.data.responseCode === 1) {
        goTo(Listening, { toListening: 1 }); //from another prescription
      } else {
        console.log(response.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex">
      <div className="prescription-container">
        <div className="prescription-wrapper">
          <div className="logo-wrapper">
            <div className="row align-items-center">
              <div className="col-3">
                <LogoIcon />
              </div>
              <div className="col-9">
                <span style={{ color: "#c42753" }}>{propsData && propsData.query}</span>
              </div>
            </div>
          </div>
          <div className="profile-block d-flex mt-5">
            <FontAwesomeIcon icon={faUser} />
            <div>
              <h5>{propsData && propsData.patientName}</h5>
              <span>12-dec-1998(22 years) | male</span>
            </div>
          </div>
          <div className="history-block d-flex mt-3" onClick={handleClickHistory}>
            <FontAwesomeIcon icon={faCalendarWeek} />
            <h3>Medication History</h3>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
          {cartList &&
            cartList.map((item, index) => {
              return <RecordItem key={index} cartItem={item} />;
            })}
          <h4 className="mt-3">New Prescription</h4>
          <div className="d-flex mt-3 prescription-item">
            <div>
              <label>Medication</label>
              <p>{propsData && propsData.drugName + propsData && propsData.drugSize}</p>
            </div>
            <SmallMicIcon />
          </div>
          <div className="row">
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Duration(days)</label>
                  <p>{propsData && propsData.drugDuration}</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Quantity</label>
                  <p>{propsData && propsData.drugDosage}</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Refills</label>
                  <p>{propsData && propsData.drugRepeat}</p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <label>Substitutions</label>
              <label className="toggle-switch">
                <input type="checkbox" onChange={handleSwitchSubstitution} checked={checked} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>Start Date</label>
                  <p className={propsData && propsData.drugDuration ? "" : "placeholder-font"}>
                    {propsData && propsData.drugDuration ? startDate : "Unavailable"}
                  </p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex mt-3 prescription-item">
                <div>
                  <label>End Date</label>
                  <p className={propsData && propsData.drugDuration ? "" : "placeholder-font"}>
                    {propsData && propsData.drugDuration ? endDate : "Unavailable"}
                  </p>
                </div>
                <SmallMicIcon />
              </div>
            </div>
          </div>
          <div className="d-flex mt-3 prescription-item">
            <div>
              <label>Instructions</label>
              <p className={propsData && propsData.drugInstructions ? "" : "placeholder-font"}>
                {propsData && propsData.drugInstructions ? propsData.drugInstructions : "Unavailable"}
              </p>
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
          <div onClick={handleClickAnotherPrescription} style={{ cursor: "pointer" }}>
            <h2 className="mt-3">Add another Prescription</h2>
          </div>
          <Button type="button" className="main-btn mt-3" onClick={handleClickConfirm}>
            Confirm
          </Button>
          <div className="mt-4 mb-3 d-inline-block" onClick={handleClickListening}>
            <MicIcon />
          </div>
        </div>
      </div>
      <MedicHistory history={history} onClickItem={handleClickItem} />
    </div>
  );
}

export default Prescription;
