// status.jsx
import React from "react";

export const SafetyStatus = (props) => (
  <button className="status safetyButton">
    {props.status}
  </button>
);

export const DangerStatus = (props) => (
  <button className="status dangerButton">
    {props.status}
  </button>
);

export const WarningStatus = (props) => (
  <button className="status warningButton">
    {props.status}
  </button>
);

