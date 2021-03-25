/*global chrome*/
import React from "react";
import { LogoIcon } from "../../assets/icons/LogoIcon";
import { UncontrolledTooltip } from "reactstrap";

function TopLogo() {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };
  return (
    <>
      <div id="logoTooltip" style={{ width: "60px", height: "50px" }}>
        <LogoIcon />
        <UncontrolledTooltip placement="right" target="logoTooltip">
          {process.env.REACT_APP_BUILD_NUMBER}
        </UncontrolledTooltip>
      </div>
    </>
  );
}

export default TopLogo;
