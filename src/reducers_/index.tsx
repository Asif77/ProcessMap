import {combineReducers} from 'redux';
import map from './mapViewReducer';
import nav from './navReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';


const rootReducer = combineReducers({
  map,
  nav,
  ajaxCallsInProgress
});

export default rootReducer;
