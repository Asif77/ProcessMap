import * as types from "../actions/actionTypes";
//import initialState from './initialState';

function actionTypeEndsInSuccess(type: any) {
  return type.substring(type.length - 8) === "_SUCCESS";
}

export default function ajaxStatusReducer(state = 0, action: any) {
  if (action.type === types.BEGIN_AJAX_CALL) {
    return state + 1;
  } else if (
    action.type === types.AJAX_CALL_ERROR ||
    actionTypeEndsInSuccess(action.type)
  ) {
    return state - 1;
  }

  return state;
}
