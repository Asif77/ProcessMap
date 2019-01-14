import * as types from "../actions/actionTypes";

export default function localizedReducer(state: any = [], action: any) {
  switch (action.type) {
    case types.LOAD_LOCALIZED_DATA_SUCCESS:
      return action.payLoad.data;
    case types.LOAD_LOCALIZED_DATA_FAILED:
      return action.payLoad.error;
    default:
      return state;
  }
}
