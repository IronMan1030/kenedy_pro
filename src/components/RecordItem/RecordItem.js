/*global chrome*/
import React, { useState, useEffect } from "react";
import "./RecordItem.scss";

function RecordItem({ cartItem }) {
  const console = {
    log: (info) => chrome.extension.getBackgroundPage().console.log(info),
  };

  const handleClickItem = () => {
    console.log();
  };
  console.log(`cartItem1: ${cartItem}`);
  return (
    <div className="item-wrapper">
      <div className="mt-3 item-content" onClick={handleClickItem}>
        <div>
          <h3>{cartItem && cartItem.drug_name}</h3>
          <span>edit</span>
        </div>
        <p>{cartItem && cartItem.query}</p>
      </div>
    </div>
  );
}

export default RecordItem;
