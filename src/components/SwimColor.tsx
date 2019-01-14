import * as React from "react";
import * as d3 from "d3";

class SwimColor extends React.Component<ISwimColorProps, any> {
  constructor(props: ISwimColorProps) {
    super(props);

    this.state = {
      textSize: null
    };
  }

  componentDidMount() {
    this.calculateTextSize();
  }

  getTextWidth = () => {
    const { textSize } = this.state;

    if (textSize !== null) return textSize.width;

    return 0;
  };

  calculateTextSize = () => {
    let selection = d3.select(this.refs.text);
    let size = selection.node().getBBox();

    this.setState({ textSize: size });
  };

  render() {
    const { x, y, textX, textY, name, color } = this.props;

    //let p = this.getTextWidth() + textX * 2;
    //let xp = "-" + p.toString() + "px";
    const style = {
      fontFamily: "Arial",
      fontSize: "10.25"
      //transform: `scaleX(-1) translate(${xp}, 0px)`
    };

    return (
      <g>
        <rect x={x} y={y} width="16" height="16" rx="3" ry="3" fill={color} />
        <text x={textX} y={textY} fill="black" ref="text" style={style}>
          {name}
        </text>
      </g>
    );
  }
}

export default SwimColor;

interface ISwimColorProps {
  x: number;
  y: number;
  textX: number;
  textY: number;
  name: string;
  color: string;
}
