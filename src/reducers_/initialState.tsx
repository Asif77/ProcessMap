import { mapObjectSelection } from "../components/constant";
import { MapData } from "../interface/map";

const map: MapData = {
  ProcessName: "",
  Steps: [],
  StepContexts: [],
  TextObjects: [],
  SwimColors: [],
  SwimPools: [],
  SwimPoolHight: 0,
  Style: "{ backgroundColor: 'white' }",
  Height: 1600,
  Width: 1600
};

// let map = new CMap();
// map.Steps = [];
// map.StepContexts = [];
// map.Style = "{ backgroundColor: 'white' }";
// map.Height = 1600;
// map.Width = 1600;

export default {
  map: map,
  nav: mapObjectSelection.Pointer,
  //localizedData: [],
  ajaxCallsInProgress: 0
};
