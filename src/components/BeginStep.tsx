import * as React from "react";
import * as d3 from "d3";

import * as CSS from "csstype";
import GenericStep from "./GenericStep";
import * as ImageConst from "./imageConst";
import {
  BEGIN_STEP,
  BEGIN_STEP_BPMN,
  START_BPMN,
  BEGIN_STEP_HOVER /*, BEGIN_STEP_SELECTED*/
} from "./MapImages";

class BeginStep extends GenericStep {
  componentDidMount() {
    this.calculateTextSize();
  }

  handleMouseDown = (e: any) => {
    //let selection = d3.select(this.refs.image);
    //selection.attr('href', BEGIN_STEP_SELECTED);
  };

  handleMouseEnter = (e: any) => {
    let selection = d3.select(this.refs.image);
    selection.attr("href", BEGIN_STEP_HOVER);
  };

  handleMouseLeave = (e: any) => {
    let selection = d3.select(this.refs.image);
    selection.attr(
      "href",
      this.props.isBPMNView === true ? BEGIN_STEP_BPMN : BEGIN_STEP
    );
  };

  reverseString = (str: string) => {
    return str
      .split("")
      .reverse()
      .join("");
  };

  render() {
    const {
      selectStep,
      stopDragging,
      showStepProps,
      isBPMNView,
      localizedName
    } = this.props;

    const { Name, strSimColor, Location } = this.props.step;

    const fill = `url(#${strSimColor})`;
    const showRect = strSimColor ? true : false;

    //let x = this.getTextWidth() + this.getTextX() * 2;
    //let xp = "-" + x.toString() + "px";

    //let sc = `scaleX(-1) translate(${xp}, 0px)`;
    //console.log(this.getTextWidth(), this.getTextX(), sc);

    const style: CSS.Properties<string | number> = {
      //transform: `scaleX(-1) translate(${xp}, 0px)`
      // position: "absolute",
      //transformOrigin: "0px  0px"
      //left: this.getTextX(),
      //top: this.getTextY()
    };

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
          href={isBPMNView === true ? BEGIN_STEP_BPMN : BEGIN_STEP}
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
        {isBPMNView === true ? (
          <g>
            <image
              href={START_BPMN}
              id={Name}
              x={this.getBPMNStartX()}
              y={this.getBPMNStartY()}
              width={ImageConst.IMAGEWIDTH}
              height={ImageConst.IMAGEHEIGHT}
              cursor="pointer"
              ref="startImage"
            />
            <text
              x={this.getBPMNStartX() + 4}
              y={this.getTextY()}
              fill="black"
              ref="text"
            >
              Start
            </text>
          </g>
        ) : (
          <g />
        )}
        <image
          href={this.getStateImage()}
          id={Name}
          x={this.getStateImageX()}
          y={this.getStateImageY()}
          width={ImageConst.STATEIMAGEWIDTH}
          height={ImageConst.STATEIMAGEHEIGHT}
          cursor="pointer"
        />
        <text
          x={this.getTextX()}
          y={this.getTextY()}
          fill="black"
          ref="text"
          style={style}
        >
          {localizedName === "" ? Name : localizedName}
        </text>
      </g>
    );
  }
}

export default BeginStep;
