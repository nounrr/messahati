import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SafetyStatus = (props) => /* @__PURE__ */ jsx("button", { className: "status safetyButton", children: props.status });
const DangerStatus = (props) => /* @__PURE__ */ jsx("button", { className: "status dangerButton", children: props.status });
const WarningStatus = (props) => /* @__PURE__ */ jsx("button", { className: "status warningButton", children: props.status });
const Home = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Status" }),
    /* @__PURE__ */ jsx("p", { children: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam est quaerat voluptas sequi optio? Assumenda impedit excepturi minima qui ullam odio similique, eos inventore dignissimos iure! Veniam maxime optio consectetur." }),
    /* @__PURE__ */ jsx(SafetyStatus, { status: "Safe" }),
    /* @__PURE__ */ jsx(DangerStatus, { status: "Danger" }),
    /* @__PURE__ */ jsx(WarningStatus, { status: "Warning" })
  ] });
};
export {
  Home as default
};
