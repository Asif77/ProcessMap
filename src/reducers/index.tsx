import { combineReducers } from "redux";
import data from "./mapViewReducer";
import nav from "./navReducer";
import localizedData from "./localizedReducer";
import ajaxCallsInProgress from "./ajaxStatusReducer";

const rootReducer = combineReducers({
  data,
  nav,
  localizedData,
  ajaxCallsInProgress
});

export default rootReducer;
