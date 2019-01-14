import * as React from "react";
import * as ImageConst from "./imageConst";
import SwimColor from "./SwimColor";
import { ISwimPool, ISwimColor } from "../interface/map";

class SwimPool extends React.Component<ISwimPoolProps> {
  render() {
    const { swimPool, swimColors } = this.props;

    return (
      <g>
        {swimColors
          ? swimColors.map((swimColor: ISwimColor, i: number) => {
              return (
                <SwimColor
                  key={swimColor.Name}
                  x={swimPool.Location.X}
                  y={
                    swimPool.Location.Y +
                    i * ImageConst.SWIMCOLORSIZE +
                    ImageConst.SWIMCOLORSGAP * i
                  }
                  textX={swimPool.Location.X + ImageConst.SWIMCOLORSIZE * 2}
                  textY={
                    swimPool.Location.Y +
                    i * ImageConst.SWIMCOLORSIZE +
                    ImageConst.SWIMCOLORSGAP * i +
                    ImageConst.SWIMCOLORSIZE / 4 +
                    7
                  }
                  name={swimColor.Name}
                  color={swimColor.Color}
                />
              );
            })
          : null}
      </g>
    );
  }
}

export default SwimPool;

interface ISwimPoolProps {
  swimPool: ISwimPool;
  swimColors: ISwimColor[];
}
