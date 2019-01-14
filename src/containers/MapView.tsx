import * as React from "react";
//import PropTypes from 'prop-types';
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import bindme from "bindme";
import * as d3 from "d3";

import * as mapActions from "../actions/mapViewActions";
import * as navActions from "../actions/navActions";

import { MapData, IParam, Step } from "../interface/map";
import * as ImageConst from "../components/imageConst";
import Map from "../components/Map";
import "./MapView.css";
import PropsPage from "../components/PropsPage";
import { mapObjectSelection } from "../components/constant";
import { BpmLocale } from "../interface/map";

class MapView extends React.Component<IMapViewProps, IMapViewState> {
  constructor(props: IMapViewProps) {
    super(props);

    bindme(
      this,
      "onDocumentKeydown",
      "onDocumentKeyup",
      "onMouseDown",
      "onMouseEnter",
      "onMouseLeave",
      "onMouseMove",
      "onMouseUp",
      "onWindowResize",
      "onWindowScroll",
      "selectStep",
      "stopDragging",
      "showStepProps"
    );

    this.state = {
      dragging: null,
      isMouseDown: false,
      isMouseMoving: false,
      isMouseOver: true,
      offset: { x: 0, y: 0 },
      scroll: { x: 0, y: 0 },
      selected: {},
      shiftPressed: false,
      toolbarHeight: 0,
      drag_line: {},
      sourcestep: {},
      destinationstep: {},
      stepPropsShown: false,
      step: {},
      size: { height: 800, width: 600 },
      actions: {
        mapActions: {},
        navActions: {}
      }
    };
  }

  loadMap = () => {
    const {
      protocol,
      hostName,
      processName,
      version,
      incident,
      bpmServer,
      serverId,
      language
    } = this.props.params;

    const servers = (window as any).env.BPM_SERVERS;
    console.log(servers);
    let server = "";
    servers.forEach((element: string) => {
      let vals = element.split("=");
      if (vals.length > 1 && vals[0] === bpmServer) {
        server = vals[1].trim();
        console.log(server);
        return;
      }
    });

    if (processName) {
      this.props.actions.mapActions.loadProcessMap(
        server,
        processName,
        version,
        incident
      );

      this.props.actions.mapActions.loadLocalizedData(
        `${protocol}//${hostName}`,
        serverId,
        processName,
        language
      );
    }
  };

  componentDidMount() {
    this.loadMap();

    let header = document.getElementById("header");
    const height = header ? header.clientHeight : 0;

    let node: Node | null = ReactDOM.findDOMNode(this);

    if (node === null) return;

    let container: any = node.parentNode;

    document.addEventListener("keydown", this.onDocumentKeydown);
    document.addEventListener("keyup", this.onDocumentKeyup);

    window.addEventListener("scroll", this.onWindowScroll);
    window.addEventListener("resize", this.onWindowResize(container));

    const offset = {
      x: container.offsetLeft,
      y: container.offsetTop
    };

    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    };

    // line displayed when dragging new nodes
    let svg = d3.select("svg");
    const dragline = svg
      .append("svg:path")
      .attr("class", "link dragline hidden")
      .attr("d", "M0,0 L0,0");

    this.setState({
      offset,
      scroll,
      toolbarHeight: height,
      drag_line: dragline
    });

    this.setState({ size: this.getBrowserSize() });
  }

  getDrawLink = () => {
    return this.props.nav === mapObjectSelection.Link ? true : false;
  };

  createArrow = (event: any) => {
    event.stopPropagation();
  };

  getCoordinates = (event: any) => {
    const { offset, scroll, toolbarHeight } = this.state;

    return {
      x: event.clientX - offset.x + scroll.x,
      y: event.clientY - offset.y - toolbarHeight + scroll.y
    };
  };

  isInsideMap = (coordinates: any) => {
    const { offset, scroll, toolbarHeight } = this.state;

    const { Height, Width } = this.props.map;

    return (
      coordinates.x > offset.x + scroll.x &&
      coordinates.x < offset.x + scroll.x + Width &&
      coordinates.y > offset.y + scroll.y + toolbarHeight &&
      coordinates.y < offset.y + scroll.y + Height
    );
  };

  onDocumentKeydown = (event: any) => {
    const { code } = event;

    switch (code) {
      case "Escape":
        this.setState({ selected: {} });
        break;

      case "ShiftLeft":
      case "ShiftRight":
        this.setState({ shiftPressed: true });
        break;

      case "Delete":
        break;

      default:
        break;
    }
  };

  onDocumentKeyup = (event: any) => {
    const { code } = event;

    switch (code) {
      case "ShiftLeft":
      case "ShiftRight":
        this.setState({ shiftPressed: false });
        break;

      default:
        break;
    }
  };

  getBrowserSize = () => {
    var myWidth = 0,
      myHeight = 0;
    if (typeof window.innerWidth === "number") {
      //Non-IE
      myWidth = window.innerWidth;
      myHeight = window.innerHeight;
    } else if (
      document.documentElement &&
      (document.documentElement.clientWidth ||
        document.documentElement.clientHeight)
    ) {
      //IE 6+ in 'standards compliant mode'
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
    } else if (
      document.body &&
      (document.body.clientWidth || document.body.clientHeight)
    ) {
      //IE 4 compatible
      myWidth = document.body.clientWidth;
      myHeight = document.body.clientHeight;
    }

    let size = {
      height: this.state.toolbarHeight
        ? myHeight - this.state.toolbarHeight
        : myHeight,
      width: myWidth
    };

    return size;
  };

  onMouseDown = (event: any) => {
    const { stepPropsShown } = this.state;

    if (stepPropsShown) return;

    const coordinates = this.getCoordinates(event);

    const mapSelection = this.isInsideMap(coordinates)
      ? {
          x: coordinates.x,
          y: coordinates.y,
          height: 0,
          width: 0
        }
      : null;

    this.setState({
      isMouseDown: true,
      mapSelection,
      selected: {}
    });

    if (this.props.nav === mapObjectSelection.User) {
      const id = Math.floor(Math.random() * 1000000);
      let user = {
        $type: "Ultimus.ProcessMap.UserStep, Ultimus.ProcessMap",
        StepTypeName: "User",
        Id: id,
        Name: id,
        Links: [],
        Location: {
          X: coordinates.x,
          Y: coordinates.y
        }
      };

      this.setDefaultMapObjectSelection();

      this.props.actions.mapActions.addStep(user);
    }

    if (this.props.nav === mapObjectSelection.Junction) {
      const id = Math.floor(Math.random() * 1000000);
      let junction = {
        $type: "Ultimus.ProcessMap.JunctionStep, Ultimus.ProcessMap",
        StepTypeName: "Junction",
        Id: id,
        Name: id,
        Links: [],
        Location: {
          X: coordinates.x,
          Y: coordinates.y
        }
      };

      this.setDefaultMapObjectSelection();

      this.props.actions.mapActions.addStep(junction);
    }
  };

  onMouseEnter = () => {
    this.setState({
      isMouseOver: true,
      mapSelection: null
    });
  };

  onMouseLeave = () => {
    this.setState({
      isMouseOver: false,
      mapSelection: null
    });
  };

  onMouseMove = (event: any) => {
    const {
      dragging,
      isMouseDown,
      mapSelection,
      selected,
      drag_line,
      sourcestep,
      stepPropsShown
    } = this.state;

    if (stepPropsShown) return;

    const { map } = this.props;

    if (!isMouseDown) return;

    const coordinates = this.getCoordinates(event);

    if (mapSelection) {
      this.setState({
        mapSelection: {
          x: mapSelection.x,
          y: mapSelection.y,
          height: coordinates.y - mapSelection.y,
          width: coordinates.x - mapSelection.x
        }
      });
    } else {
      if (selected === null) {
        console.log("not selecte");
      } else if (this.getDrawLink() && sourcestep) {
        let step = this.getStep(sourcestep);

        if (!step) return;

        let startX =
          step.Location.X +
          ImageConst.CX / 2 +
          ImageConst.IMAGEWIDTH / 2 +
          ImageConst.ANCHOROFFSET;
        let startY = step.Location.Y + ImageConst.CY / 2;

        // update drag line
        drag_line.attr(
          "d",
          "M" +
            startX +
            "," +
            startY +
            "L" +
            coordinates.x +
            "," +
            coordinates.y
        );
      } else if (!this.getDrawLink()) {
        const steps = [...map.Steps];

        const deltaX = dragging ? coordinates.x - dragging.x : 0;
        const deltaY = dragging ? coordinates.y - dragging.y : 0;

        if (!this.isInsideMap(coordinates)) return;

        steps
          .filter(({ Id }) => selected[Id])
          .forEach(step => {
            let s = JSON.parse(JSON.stringify(step));
            s.Location.X += deltaX;
            s.Location.Y += deltaY;
            this.props.actions.mapActions.updateStep(s);
          });

        this.setState({ dragging: coordinates });
      }
    }
  };

  getStep = (step: any) => {
    const { map } = this.props;

    const steps = [...map.Steps];

    return steps.filter(function(element) {
      return step[element.Id];
    })[0];
  };

  setDefaultMapObjectSelection = () => {
    this.props.actions.navActions.navSelection(mapObjectSelection.Pointer);
  };

  onMouseUp = (event: any) => {
    const {
      //mapSelection,I
      drag_line,
      sourcestep,
      stepPropsShown
      //destinationstep
    } = this.state;

    if (stepPropsShown) return;

    const { map } = this.props;

    let selected = Object.assign({}, this.state.selected);

    this.setState({
      dragging: null,
      isMouseDown: false,
      mapSelection: null,
      selected
    });

    if (this.getDrawLink()) {
      // hide drag line
      drag_line.classed("hidden", true).style("marker-end", "");

      this.setDefaultMapObjectSelection();

      let destinationStepId = "0";
      if (sourcestep) {
        map.Steps.forEach((step: Step) => {
          const coordinates = this.getCoordinates(event);

          const { Id, StepTypeName, Location } = step;

          const isInside =
            coordinates.x >= Location.X &&
            coordinates.y >= Location.Y &&
            coordinates.x <= Location.X + ImageConst.IMAGEWIDTH &&
            coordinates.y <= Location.Y + ImageConst.IMAGEHEIGHT;

          if (isInside && StepTypeName !== "Begin") destinationStepId = Id;
        });

        let sourceStep = this.getStep(sourcestep);

        if (
          destinationStepId === "0" ||
          (sourceStep && sourceStep.Id === destinationStepId)
        )
          return;

        let s = JSON.parse(JSON.stringify(sourceStep));
        let link = {
          $type: "Ultimus.ProcessMap.Link, Ultimus.ProcessMap",
          TargetStepId: destinationStepId,
          TargetStep: destinationStepId,
          Anchor: []
        };

        let ll;
        if (s.Links != null) {
          ll = s.Links.filter((l: any) => {
            return l.TargetStepId === destinationStepId;
          })[0];
        }
        if (!ll) {
          s = { ...s, Links: [...s.Links, link] };

          this.props.actions.mapActions.updateStep(s);
        }
      }
    }
  };

  onWindowResize = (container: any) => {
    return () => {
      //const rect = container.getBoundingClientRect();
      const size = this.getBrowserSize();

      this.setState({ size: size });
    };
  };

  onWindowScroll = () => {
    const scroll = {
      x: window.scrollX,
      y: window.scrollY
    };

    this.setState({ scroll });
  };

  selectStep = (id: any) => {
    return (event: any) => {
      event.stopPropagation();

      const { selected, shiftPressed, drag_line, stepPropsShown } = this.state;

      if (stepPropsShown) this.updateMap();

      let selectedStep = shiftPressed ? Object.assign({}, selected) : {};
      selectedStep[id] = true;

      let step = Object.assign({}, this.getStep(selectedStep));
      this.setState({
        isMouseDown: true,
        selected: selectedStep,
        sourcestep: selectedStep,
        step: step
      });

      // reposition drag line
      if (this.getDrawLink()) {
        if (step.Name === "End") return;

        let startX =
          step.Location.X +
          ImageConst.CX / 2 +
          ImageConst.IMAGEWIDTH / 2 +
          ImageConst.ANCHOROFFSET;
        let startY = step.Location.Y + ImageConst.CY / 2;

        drag_line
          .style("marker-start", "url(#Circle)")
          .style("marker-end", "url(#Triangle)")
          .classed("hidden", false)
          .attr("d", "M" + startX + "," + startY + "L" + startX + "," + startY);
      }
    };
  };

  showStepProps = (id: any) => {
    return (event: any) => {
      event.stopPropagation();

      const { selected, shiftPressed } = this.state;

      let selectedStep = shiftPressed ? Object.assign({}, selected) : {};
      selectedStep[id] = true;

      this.setState({
        selected: selectedStep,
        stepPropsShown: true
      });
    };
  };

  updateMap = () => {
    //this.props.actions.updateMap(this.state.step);
    // const { step } = this.state;
    // const { map } = this.props;
    // const steps = [...map.Steps];
    // steps
    //     .filter(s => s.Name === step.Name)
    //     .forEach(s => {
    //         Object.assign(s, step);
    //     });
  };

  closeStepProps = () => {
    this.updateMap();

    this.setState({
      stepPropsShown: false,
      step: {}
    });
  };

  updateStepProps = (event: any) => {
    const field = event.target.name;
    let step = Object.assign({}, this.state.step);
    step[field] = event.target.value;
    return this.setState({ step: step });
  };

  stopDragging = (id: any) => {
    return (event: any) => {
      this.setState({
        dragging: null,
        isMouseDown: false,
        mapSelection: null
      });
    };
  };

  isEmpty = (o: any) => {
    for (var i in o) {
      if (o.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  };

  public renderProperty(): JSX.Element {
    const { step, stepPropsShown } = this.state;

    if (stepPropsShown === false) return <div />;

    return (
      <PropsPage
        step={step}
        onChange={this.updateStepProps}
        closeStepProps={this.closeStepProps}
      />
    );
  }

  public renderMap = (): JSX.Element => {
    const { map, bpmLocale } = this.props;

    const { mapSelection, selected, size } = this.state;

    const style = { display: "flex", justifyContent: "space-between" };

    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        style={style}
        //onDrop="drop(event)"
        //onDragover="allowDrop(event)"
      >
        <Map
          map={map}
          bpmLocale={bpmLocale}
          params={this.props.params}
          mapSelection={mapSelection}
          selected={selected}
          selectStep={this.selectStep}
          stopDragging={this.stopDragging}
          showStepProps={this.showStepProps}
          size={size}
        />
        <section>{this.renderProperty()}</section>
      </div>
    );
  };

  public renderMapView = (): JSX.Element => {
    const { map, bpmLocale } = this.props;

    const { mapSelection, selected, size } = this.state;

    //const style = { display: "flex", justifyContent: "space-between" };

    return (
      //<div style={style}>
      <Map
        map={map}
        bpmLocale={bpmLocale}
        params={this.props.params}
        mapSelection={mapSelection}
        selected={selected}
        selectStep={this.selectStep}
        stopDragging={this.stopDragging}
        showStepProps={this.showStepProps}
        size={size}
      />
      //</div>
    );
  };

  render() {
    const { editable } = this.props.params;

    const errorStyle = { color: "red" };

    if (this.props.hasErrored) {
      return (
        <span style={errorStyle}>
          <i>{this.props.errorMessage}</i>
        </span>
      );
    }

    if (this.props.isLoading) {
      return (
        <span>
          <i>Loading...</i>
        </span>
      );
    } else {
      return editable ? (
        <React.Fragment>{this.renderMap()}</React.Fragment>
      ) : (
        <React.Fragment>{this.renderMapView()}</React.Fragment>
      );
    }
  }
}

// MapView.prototype = {
//     map: PropTypes.object.isRequired: {map: any}
//     //actions: PropTypes.object.isRequired
// };

function mapStateToProps(state: any, ownProps: any) {
  return {
    map: state.data.map,
    nav: state.nav,
    bpmLocale: state.localizedData,
    isLoading: state.data.isLoading,
    hasErrored: state.data.hasErrored,
    errorMessage: state.data.errorMessage
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: {
      mapActions: bindActionCreators(mapActions, dispatch),
      navActions: bindActionCreators(navActions, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView);

interface IMapSelection {
  x: number;
  y: number;
  height: number;
  width: number;
}

interface IMapViewState {
  dragging?: any;
  isMouseDown: boolean;
  isMouseMoving: boolean;
  isMouseOver: boolean;
  offset: any;
  mapSelection?: IMapSelection | null;
  scroll: any;
  selected: any;
  shiftPressed: boolean;
  toolbarHeight: number;
  drag_line: any;
  sourcestep: {};
  destinationstep: {};
  stepPropsShown: boolean;
  step: {};
  size: {};
  actions: any;
}

interface IMapViewProps {
  map: MapData;
  nav: number;
  bpmLocale: BpmLocale[];
  params: IParam;
  actions: any;
  isLoading: boolean;
  errorMessage: string;
  hasErrored: boolean;
}
