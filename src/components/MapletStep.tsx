import * as React from "react";
import GenericStep from "./GenericStep";
import * as ImageConst from "./imageConst";

import { MAPLET, MAPLET_BPMN } from "./MapImages";

class MapletStep extends GenericStep {
  componentDidMount() {
    this.calculateTextSize();
  }

  render() {
    const { selectStep, stopDragging, isBPMNView } = this.props;

    const { Name, strSimColor, Location } = this.props.step;

    const fill = `url(#${strSimColor})`;
    const showRect = strSimColor ? true : false;

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
          href={isBPMNView === true ? MAPLET_BPMN : MAPLET}
          id={Name}
          x={this.getImageX()}
          y={this.getImageY()}
          width={ImageConst.IMAGEWIDTH}
          height={ImageConst.IMAGEHEIGHT}
          cursor="pointer"
          ref="image"
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          //onMouseDown={this.handleMouseDown}
        />
        <text x={this.getTextX()} y={this.getTextY()} fill="black" ref="text">
          {Name}
        </text>
      </g>
    );
  }
}

export default MapletStep;
