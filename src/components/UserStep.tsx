import * as React from "react";
import * as d3 from "d3";

import GenericStep from "./GenericStep";
import * as ImageConst from "./imageConst";
import { RecipientTypes } from "./constant";
import {
  USER_STEP,
  USER_STEP_BPMN,
  QUEUE,
  QUEUE_BPMN,
  GROUP_BPMN,
  GROUP,
  DEPARTMENT_BPMN,
  DEPARTMENT /*, USER_STEP_SELECTED*/,
  USER_STEP_HOVER
} from "./MapImages";

class UserStep extends GenericStep {
  handleMouseDown = (e: any) => {
    //let selection = d3.select(this.refs.image);
    //selection.attr('href', USER_STEP_SELECTED);
  };

  handleMouseEnter = (e: any) => {
    let selection = d3.select(this.refs.image);
    selection.attr("href", USER_STEP_HOVER);
  };

  handleMouseLeave = (e: any) => {
    let selection = d3.select(this.refs.image);
    selection.attr(
      "href",
      this.props.isBPMNView === true ? USER_STEP_BPMN : USER_STEP
    );
  };

  componentDidMount() {
    this.calculateTextSize();
  }

  getImage = () => {
    const { isBPMNView } = this.props;

    let image = isBPMNView === true ? USER_STEP_BPMN : USER_STEP;

    if (this.props.stepContext) {
      const { RecipientType } = this.props.stepContext;

      if (
        RecipientType === RecipientTypes.Que ||
        RecipientType === RecipientTypes.FirstAvailOnlinePerson ||
        RecipientType === RecipientTypes.GroupSequential ||
        RecipientType === RecipientTypes.GroupWeighted
      ) {
        image = isBPMNView === true ? QUEUE_BPMN : QUEUE;
      } else if (RecipientType === RecipientTypes.Group) {
        image = isBPMNView === true ? GROUP_BPMN : GROUP;
      } else if (RecipientType === RecipientTypes.ChartName) {
        image = isBPMNView === true ? DEPARTMENT_BPMN : DEPARTMENT;
      } else {
        image = isBPMNView === true ? USER_STEP_BPMN : USER_STEP;
      }
    }

    return image;
  };

  render() {
    const {
      selectStep,
      stopDragging,
      showStepProps,
      localizedName
    } = this.props;

    const { Name, strSimColor, Location } = this.props.step;

    const fill = `url(#${strSimColor})`;
    const showRect = strSimColor ? true : false;

    return (
      <g
        onMouseDown={selectStep}
        onMouseUp={stopDragging}
        onDoubleClick={showStepProps}
      >
        {showRect === true ? (
          <rect
            x={Location.X}
            y={Location.Y}
            width={ImageConst.CX}
            height={ImageConst.CY}
            rx={ImageConst.SWIMCOLORRECT_RX}
            ry={ImageConst.SWIMCOLORRECT_RY}
            fill={fill}
            stroke={ImageConst.SWIMCOLORRECT_STROKE}
            strokeWidth={ImageConst.SWIMCOLORRECT_STROKEWIDTH}
          />
        ) : (
          ""
        )}
        <image
          href={this.getImage()}
          id={Name}
          x={this.getImageX()}
          y={this.getImageY()}
          width={ImageConst.IMAGEWIDTH}
          height={ImageConst.IMAGEHEIGHT}
          cursor="pointer"
          ref="image"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onMouseDown={this.handleMouseDown}
          //onMouseEnter={this.handleMouseEnter}
          //onMouseLeave={this.handleMouseLeave}
        />
        <image
          href={this.getStateImage()}
          id={Name}
          x={this.getStateImageX()}
          y={this.getStateImageY()}
          width={ImageConst.STATEIMAGEWIDTH}
          height={ImageConst.STATEIMAGEHEIGHT}
          cursor="pointer"
        />
        <text x={this.getTextX()} y={this.getTextY()} fill="black" ref="text">
          {localizedName === "" ? Name : localizedName}
        </text>
      </g>
    );
  }
}

export default UserStep;
