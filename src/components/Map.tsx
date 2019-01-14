import * as React from "react";
import * as ImageConst from "./imageConst";
import { ReactSVGPanZoom } from "react-svg-pan-zoom";
import * as CSS from "csstype";
import MapSelection from "./MapSelection";
import BeginStep from "./BeginStep";
import EndStep from "./EndStep";
import UserStep from "./UserStep";
import FlobotStep from "./FlobotStep";
import Polyline from "./Polyline";
import JunctionStep from "./JunctionStep";
import MapletStep from "./MapletStep";
import TextObject from "./TextObject";
import "./Map.css";
import SwimPool from "./SwimPool";
import {
  MapData,
  Step,
  Link,
  Anchor,
  AssociationLink,
  VLink,
  IParam,
  ISwimColor,
  BpmLocale
} from "../interface/map";
import { LocaleType } from "./constant";

const component: any = {
  Begin: BeginStep,
  End: EndStep,
  User: UserStep,
  Junction: JunctionStep,
  Flobot: FlobotStep,
  Maplet: MapletStep
};

class Map extends React.Component<IMap, IMapState> {
  Viewer: any;
  constructor(props: IMap, context: any) {
    super(props, context);
    this.Viewer = null;

    this.state = {
      translation: { x: 0, y: 0, scaleFactor: -1 },
      tool: "none"
    };
  }

  onWindowResize = () => {
    return () => {
      if (this.Viewer) this.Viewer.fitToViewer();
    };
  };

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize());

    this.Viewer.fitToViewer();
  }

  getTextObject = (id: string) => {
    const { map } = this.props;

    const textObjects = [...map.TextObjects];

    return textObjects.filter(function(element) {
      return id === element.Id;
    })[0];
  };

  getStep = (id: string) => {
    const { map } = this.props;

    const steps = [...map.Steps];

    return steps.filter(function(element) {
      return id === element.Id;
    })[0];
  };

  getStepByName = (name: string) => {
    const { map } = this.props;

    const steps = [...map.Steps];

    return steps.filter(function(element) {
      return name === element.Name;
    })[0];
  };

  getStepContext = (id: string) => {
    const { map } = this.props;

    const stepContexts = [...map.StepContexts];

    return stepContexts.filter(function(element) {
      return id === element.StepID;
    })[0];
  };

  getLinkPoints = (srourceStep: Step, targetLink: Link) => {
    let targetStep = this.getStep(targetLink.TargetStepId);

    if (!targetStep) return;

    let startX =
      srourceStep.Location.X +
      ImageConst.CX / 2 +
      ImageConst.IMAGEWIDTH / 2 +
      ImageConst.ANCHOROFFSET;
    let startY = srourceStep.Location.Y + ImageConst.CY / 2;

    let endX =
      targetStep.Location.X +
      ImageConst.CX / 2 -
      ImageConst.IMAGEWIDTH / 2 -
      ImageConst.ANCHOROFFSET;
    let endY = targetStep.Location.Y + ImageConst.CY / 2;

    let p = " ";
    if (targetLink.Anchor !== null && targetLink.Anchor.length > 0) {
      targetLink.Anchor.map((a: Anchor) => (p += " " + a.X + "," + a.Y + " "));
    }

    return startX + "," + startY + p + endX + "," + endY;
  };

  getAssociationLinkPoints = (
    srourceStep: Step,
    targetLink: AssociationLink
  ) => {
    let targetStep = this.getTextObject(targetLink.linkStepId);

    if (!targetStep) return;

    let startX =
      srourceStep.Location.X +
      ImageConst.CX / 2 +
      ImageConst.IMAGEWIDTH / 2 +
      ImageConst.ANCHOROFFSET;
    let startY = srourceStep.Location.Y + ImageConst.CY / 2;

    let endX =
      targetStep.Location.X +
      ImageConst.CX / 2 -
      ImageConst.IMAGEWIDTH / 2 -
      ImageConst.ANCHOROFFSET;
    let endY = targetStep.Location.Y; // + (ImageConst.CY/2);

    return startX + "," + startY + " " + endX + "," + endY;
  };

  generateLinks = () => {
    const { map } = this.props;

    const { Steps } = map;

    return Steps.map((step: Step, i: number) => {
      if (step && step.Name !== "End" && step.Links.length > 0) {
        return step.Links.map((link: Link, j: number) => {
          let points = this.getLinkPoints(step, link);
          let key = step.Id + "$$" + link.TargetStepId;
          return (
            <Polyline
              key={key}
              id={key}
              points={points}
              markerStart={true}
              editable={this.props.params.editable}
            />
          );
        });
      } else {
        return [];
      }
    });
  };

  generateVLinks = () => {
    const { map } = this.props;

    const { Steps } = map;

    return Steps.map((step: Step, i: number) => {
      if (
        step &&
        step.Name !== "End" &&
        step.VLinks &&
        step.VLinks.length > 0
      ) {
        return step.VLinks.map((link: VLink, j: number) => {
          let points = this.getLinkPoints(step, link);
          let key = step.Name + link.TargetStepId;
          return (
            <Polyline
              key={key}
              id={key}
              points={points}
              stroke={link.VColor}
              strokeDasharray={true}
              markerStart={true}
              markerEnd={false}
              editable={this.props.params.editable}
            />
          );
        });
      } else {
        return [];
      }
    });
  };

  generateAssociationLinks = () => {
    const { map } = this.props;

    const { Steps } = map;

    return Steps.map((step: Step, i: number) => {
      if (
        step &&
        step.Name !== "End" &&
        step.AssociationLinks &&
        step.AssociationLinks.length > 0
      ) {
        return step.AssociationLinks.map((link: AssociationLink, j: number) => {
          let points = this.getAssociationLinkPoints(step, link);
          let key = step.Name + link.linkStepId;
          return (
            <Polyline
              key={key}
              id={key}
              points={points}
              markerStart={true}
              markerEnd={false}
              strokeDasharray={true}
              editable={this.props.params.editable}
            />
          );
        });
      } else {
        return [];
      }
    });
  };

  generateBPMNStartLink = () => {
    const beginStep = this.getStepByName("Begin");

    if (!beginStep) return [];

    let startX =
      beginStep.Location.X - ImageConst.CX + ImageConst.IMAGEWIDTH - 10;
    let startY = beginStep.Location.Y + ImageConst.CY / 2.0;

    let endX =
      beginStep.Location.X + ImageConst.CX / 2 - ImageConst.IMAGEWIDTH / 2;
    let endY = beginStep.Location.Y + ImageConst.CY / 2;

    let p = " ";
    const points = startX + "," + startY + p + endX + "," + endY;
    let key = "start" + beginStep.Name;

    return (
      <Polyline
        key={key}
        id={key}
        points={points}
        markerStart={false}
        markerEnd={false}
        editable={this.props.params.editable}
      />
    );
  };

  onValueChange = (event: any) => {
    const translation = { x: event.e, y: event.f, scaleFactor: event.d };
    this.setState({ translation: translation });
  };

  getLocalizedElement = (name: string): any => {
    const { bpmLocale } = this.props;

    return bpmLocale.filter((element: BpmLocale) => {
      let labels = element.Label.split("\\*\\");
      return (
        element.LocaleType === LocaleType.Step &&
        labels.length > 1 &&
        labels[1] !== "" &&
        name === labels[1]
      );
    })[0];
  };

  getLocalizedStepName = (name: string) => {
    const { bpmLocale } = this.props;

    let localizedName = "";

    if (!bpmLocale) return localizedName;

    const aa = this.getLocalizedElement(name);

    return aa ? aa.Translation : "";

    // for (let i = 0; i < bpmLocale.length; i++) {
    //   const element = bpmLocale[i];
    //   if (element.LocaleType === LocaleType.Step) {
    //     let labels = element.Label.split("\\*\\");
    //     if (labels.length > 1 && labels[1] !== "" && name === labels[1]) {
    //       localizedName = element.Translation;
    //       break;
    //     }
    //   }
    // }
    // return localizedName;
  };

  public renderSteps(): JSX.Element[] {
    const { map, selectStep, stopDragging } = this.props;

    const { Steps } = map;

    if (Steps.length === 0) return [];

    return Steps.map((step: Step) => {
      const { Id, StepTypeName } = step;
      const Step = component[StepTypeName];
      return (
        <Step
          key={Id}
          step={step}
          localizedName={this.getLocalizedStepName(step.Name)}
          isBPMNView={this.props.params.isBPMNView}
          stepContext={this.getStepContext(Id)}
          selectStep={selectStep(Id)}
          stopDragging={stopDragging}
          editable={this.props.params.editable}
          translation={this.state.translation}
          //showStepProps={showStepProps(Name)}
        />
      );
    });
  }

  public renderTextObjects(): JSX.Element[] {
    const { map } = this.props;

    const { TextObjects } = map;

    return TextObjects.map((textObject: any, i: any) => {
      const { Id } = textObject;
      return (
        <TextObject
          key={Id}
          textObject={textObject}
          editable={this.props.params.editable}
        />
      );
    });
  }

  public defineSwimColorGradient(): JSX.Element[] {
    const { map } = this.props;

    const { SwimColors } = map;

    if (!SwimColors) return [];

    return SwimColors.map((swimColor: ISwimColor, i: number) => {
      return (
        <linearGradient id={swimColor.Name} key={i} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="25%" stopColor={swimColor.Color} stopOpacity="0.5" />
          <stop offset="50%" stopColor={swimColor.Color} stopOpacity="1" />
          <stop offset="100%" stopColor={swimColor.Color} stopOpacity="0" />
        </linearGradient>
      );
    });
  }

  public renderSwimColor(): JSX.Element[] {
    const { map } = this.props;

    const { SwimPools, SwimColors } = map;

    if (!SwimPools) return [];

    return SwimPools.map((swimPool: any, i: any) => {
      return (
        <SwimPool
          key={swimPool.strSwimID}
          swimPool={swimPool}
          swimColors={SwimColors}
        />
      );
    });
  }

  render() {
    const { map, mapSelection, size } = this.props;

    const { Height, Width } = map;

    const style: CSS.Properties<string | number> = {
      position: "relative",
      cursor: "auto",
      flexGrow: 1
      //transform: "scaleX(-1)"
    };

    const tooltipStyle: CSS.Properties<string | number> = {
      display: "none",
      position: "absolute",
      zIndex: 1001,
      backgroundColor: "black"
    };

    return (
      <React.Fragment>
        <ReactSVGPanZoom
          width={size.width}
          height={size.height}
          background="white"
          toolbarPosition="none"
          miniaturePosition="none"
          tool="auto"
          ref={(Viewer: any) => (this.Viewer = Viewer)}
          onChangeValue={this.onValueChange}
          fitToViewer={true}
          style={style}
        >
          <svg height={Height} width={Width} style={style}>
            <defs>
              <marker
                id="Triangle2"
                viewBox="0 0 10 10"
                markerWidth="8"
                markerHeight="8"
                refX="5"
                refY="5"
                orient="auto"
              >
                <circle cx="5.01" cy="5.13" r="5" fill="white" />
                <path
                  d="M8.53,1.46a5,5,0,1,0,0,7.08A5,5,0,0,0,8.53,1.46Zm-2.7,5L3.33,7.92V2.08l2.5,1.46L8.33,5Z"
                  fill="#8d9aad"
                />
              </marker>
              <marker
                id="Triangle"
                markerWidth="8"
                markerHeight="8"
                refX="5"
                refY="5"
                orient="auto"
              >
                <circle cx="5" cy="5" r="2" fill="#8d9aad" />
                <circle cx="5" cy="5" r="3" fill="#8d9aad" />
                <path d="M 4,3.5 L 6.5,5 L 4,6.5 Z" fill="white" />
                {/* <path d="M 4,3.5 L 6.5,5 L 4,6.5 Z" fill="gray"/> */}
                {/* <path d="M 0,0 L 6,3 L 0,6 z" fill="#8d9aad"/> */}
              </marker>
              <marker
                id="Circle"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <circle cx="5" cy="5" r="3" fill="#8d9aad" />
              </marker>
              <marker
                id="MidCircle"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <circle cx="5" cy="5" r="3" fill="black" />
                <circle cx="5" cy="5" r="2" fill="white" />
              </marker>
              {this.defineSwimColorGradient()}
            </defs>

            {this.renderSteps()}
            {this.renderTextObjects()}
            {this.generateLinks()}
            {this.generateVLinks()}
            {this.generateAssociationLinks()}
            {this.renderSwimColor()}

            {this.props.params.isBPMNView === true
              ? this.generateBPMNStartLink()
              : ""}

            {mapSelection ? <MapSelection {...mapSelection} /> : null}
          </svg>
        </ReactSVGPanZoom>
        <div id="tooltip" style={tooltipStyle} />
      </React.Fragment>
    );
  }
}

export default Map;

interface IMap {
  map: MapData;
  bpmLocale: BpmLocale[];
  params: IParam;
  mapSelection: any | null;
  selected: any;
  selectStep: any;
  stopDragging: any;
  showStepProps: any;
  size: any;
}

interface ITranslation {
  x: number;
  y: number;
  scaleFactor: number;
}

interface IMapState {
  translation: ITranslation;
  tool: any;
}
