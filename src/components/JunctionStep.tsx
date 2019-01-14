import * as React from "react";
import Step from "./GenericStep";
import * as ImageConst from "./imageConst";
import { JUNCTION } from "./MapImages";

class JunctionStep extends Step {
  componentDidMount() {
    this.calculateTextSize();
  }

  render() {
    const { selectStep, stopDragging, localizedName } = this.props;

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
          href={JUNCTION}
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
          {localizedName === "" ? Name : localizedName}
        </text>
      </g>
    );
  }
}

export default JunctionStep;
