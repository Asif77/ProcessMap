import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function navReducer(state = initialState.nav, action: any) {
  switch (action.type) {
    case types.NAV_SELECTION_SUCCESS2:
      return action.payLoad.newState;     
    default:
      return state;
  }
}
