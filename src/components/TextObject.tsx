import * as React from "react";
import * as CSS from "csstype";

class TextObject extends React.Component<any> {
  decimalToHex = (d: any) => {
    var hex = Number(d).toString(16);
    hex = hex + "000000".substr(0, 6 - hex.length);
    return hex;
  };

  getTextAlign = (justify: string) => {
    let textAlign = "start";
    switch (justify) {
      case "L":
        textAlign = "left";
        break;
      case "R":
        textAlign = "right";
        break;
      case "C":
        textAlign = "center";
        break;
      default:
        textAlign = "start";
        break;
    }

    return textAlign;
  };

  public render() {
    const { Name, Location, FontObj, TextColor } = this.props.textObject;

    const fontWeight = FontObj.Bold === 0 ? "normal" : "bold";
    const fontStyle = FontObj.Italic === 0 ? "normal" : "italic";
    const textAlign = this.getTextAlign(FontObj.Justify);

    const style: CSS.Properties<string | number | React.ReactText> = {
      fontFamily: `${FontObj.FaceName}`,
      fontSize: `${FontObj.Size}`,
      fill: `${this.decimalToHex(TextColor)}`,
      fontWeight: fontWeight,
      fontStyle: `${fontStyle}`,
      textAlign: textAlign as CSS.TextAlignProperty
    };

    return (
      <g>
        <text x={Location.X} y={Location.Y} style={style}>
          {Name}
        </text>
      </g>
    );
  }
}

export default TextObject;
