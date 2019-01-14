import * as types from "../actions/actionTypes";
import initialState from "./initialState";
import { Step, Data } from "../interface/map";

export interface MapState {
  data: Data;
}

export default function mapReducer(state: any = initialState, action: any) {
  switch (action.type) {
    case types.LOAD_MAP_SUCCESS:
      return action.map;
    case types.LOAD_PROCESS_MAP_SUCCESS:
      return {
        ...state,
        map: action.map,
        isLoading: false,
        hasErrored: false
      };
    case types.LOAD_PROCESS_MAP_FAILED:
      return {
        ...state,
        map: initialState.map,
        errorMessage: action.error,
        isLoading: false,
        hasErrored: true
      };
    //case types.SAVE_MAP_SUCCESS:
    //  return action.result;
    case types.UPDATE_MAP_SUCCESS:
      return {
        ...state,
        map: {
          ...state.map,
          Steps: [
            ...state.map.Steps.map((s: Step, i: number) => {
              return s.Name === action.step.Name ? action.step : s;
            })
          ]
        }
      };
    case types.UPDATE_STEP_SUCCESS:
      return {
        ...state,
        map: {
          ...state.map,
          Steps: [
            ...state.map.Steps.map((s: Step, i: number) => {
              return s.Name === action.step.Name ? action.step : s;
            })
          ]
        }
      };
    case types.ADD_STEP_SUCCESS:
      return {
        ...state,
        map: {
          ...state.map,
          Steps: [...state.map.Steps, action.step]
        }
      };
    default:
      return state;
  }
}
