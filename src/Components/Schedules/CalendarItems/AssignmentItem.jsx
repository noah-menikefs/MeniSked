import React from "react";
import { idToNameFromLists } from "../../../utils/scheduleUtils";

const AssignmentItem = ({ item, index, callList, entryList }) => {
  return (
    <li key={`s-${index}`} className="call" id="call">
      {idToNameFromLists(callList, entryList, item.id) + " "}
      <span style={{ backgroundColor: item.colour }}>{item.name}</span>
    </li>
  );
};

export default AssignmentItem;
