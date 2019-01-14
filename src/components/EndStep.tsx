import * as React from "react";
import * as d3 from "d3";
import * as CSS from "csstype";

import GenericStep from "./GenericStep";
import * as ImageConst from "./imageConst";

import {
  END_STEP,
  END_STEP_BPMN,
  END_STEP_HOVER /*, END_STEP_SELECTED*/
} from "./MapImages";

class EndStep extends GenericStep {
  componentDidMount() {
    this.calculateTextSize();
  }

  handleMouseDown = (e: any) => {
    //let selection = d3.select(this.refs.image);
    //selection.attr('href', END_STEP_SELECTED);
  };

  handleMouseEnter = (e: any) => {
    let selection = d3.select(this.refs.image);
    selection.attr("href", END_STEP_HOVER);
  };

  handleMouseLeave = (e: any) => {
    let selection = d3.select(this.refs.image);
    selection.attr(
      "href",
      this.props.isBPMNView === true ? END_STEP_BPMN : END_STEP
    );
  };

  render() {
    const { selectStep, stopDragging, isBPMNView, localizedName } = this.props;

    const { Name, strSimColor, Location } = this.props.step;

    const fill = `url(#${strSimColor})`;
    const showRect = strSimColor ? true : false;

    //let x = this.getTextWidth() + this.getTextX() * 2;
    //let xp = "-" + x.toString() + "px";
    //console.log(xp);

    const style: CSS.Properties<string | number> = {
      //transform: `scaleX(-1) translate(${xp}, 0px)`
      // position: "absolute",
      //transformOrigin: "0px  0px"
      //left: this.getTextX(),
      //top: this.getTextY()
    };

    return (
      <g onMouseDown={selectStep} onMouseUp={stopDragging}>
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
          href={isBPMNView === true ? END_STEP_BPMN : END_STEP}
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

export default EndStep;
