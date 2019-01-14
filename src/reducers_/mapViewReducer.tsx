import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { MapData, Step } from '../interface/map';

export default function mapReducer(state: MapData = initialState.map, action: any) {
  switch (action.type) {
    case types.LOAD_MAP_SUCCESS:
      return action.map;
    case types.LOAD_PROCESS_MAP_SUCCESS:
      return action.map;
    //case types.SAVE_MAP_SUCCESS:
    //  return action.result;
    case types.UPDATE_MAP_SUCCESS:  
      return {
        ...state,
        Steps: [...state.Steps.map((s: Step, i: number) => { return s.Name === action.step.Name ? action.step : s}) ] 
      }
    case types.UPDATE_STEP_SUCCESS:  
      return {
        ...state,
        Steps: [...state.Steps.map((s: Step, i: number) => { return s.Name === action.step.Name ? action.step : s}) ] 
      }
    case types.ADD_STEP_SUCCESS:
      return { 
        ...state,
        Steps:[...state.Steps, action.step]
      }
    default:
      return state;
  }
}
