import * as types from "./actionTypes";

export function navSelectionSuccess(sel: number) {
  return { type: types.NAV_SELECTION_SUCCESS2, payLoad: { newState: sel } };
}

export function navSelection(sel: number) {
  return function(dispatch: any) {
    dispatch(navSelectionSuccess(sel));
  };
}
