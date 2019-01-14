import * as types from "../actions/actionTypes";
//import initialState from './initialState';
import { mapObjectSelection } from "../components/constant";

export default function navReducer(
  state = mapObjectSelection.Pointer,
  action: any
) {
  switch (action.type) {
    case types.NAV_SELECTION_SUCCESS2:
      return action.payLoad.newState;
    default:
      return state;
  }
}
