import * as React from "react";
import * as d3 from "d3";

class Polyline extends React.Component<IPolylineProps, IPolylineState> {
  constructor(props: IPolylineProps) {
    super(props);

    this.state = {
      hilight: false
    };
  }

  isEditable = () => {
    const { editable } = this.props;

    return editable === true;
  };

  handleMouseOver = (e: React.MouseEvent<SVGPolylineElement>): void => {
    if (!this.isEditable()) return;

    let selection = d3.select(this.refs.polyline);
    selection.attr("stroke-width", "2px");
  };

  handleMouseOut = (e: React.MouseEvent<SVGPolylineElement>) => {
    if (!this.isEditable()) return;

    let selection = d3.select(this.refs.polyline);
    selection.attr("stroke-width", "1px");
  };

  handleMouseDown = (e: React.MouseEvent<SVGPolylineElement>) => {
    if (!this.isEditable()) return;

    const { hilight } = this.state;

    this.setState({ hilight: !hilight });

    hilight === false ? this.hilightAnchor() : this.clearHilightAnchor();
  };

  hilightAnchor = () => {
    let selection = d3.select(this.refs.polyline);
    selection.attr("stroke-width", "2px").attr("stroke", "yellow");
  };

  clearHilightAnchor = () => {
    let selection = d3.select(this.refs.polyline);
    selection.attr("stroke-width", "1px").attr("stroke", "gray");
  };

  render() {
    const {
      id,
      points,
      strokeDasharray,
      stroke,
      markerMid,
      markerEnd,
      markerStart
    } = this.props;

    return (
      <polyline
        key={id}
        points={points}
        fill="none"
        stroke={stroke ? stroke : "#8d9aad"}
        strokeWidth="1px"
        strokeDasharray={strokeDasharray === true ? "3, 2" : ""}
        markerStart={markerStart === true ? "url(#Circle)" : ""}
        markerMid={markerMid === true ? "url(#MidCircle)" : ""}
        markerEnd={markerEnd === false ? "" : "url(#Triangle)"}
        ref="polyline"
        cursor={this.isEditable() ? "pointer" : ""}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onMouseDown={this.handleMouseDown}
      />
    );
  }
}

export default Polyline;

interface IPolylineProps {
  id: string;
  points: any;
  strokeDasharray?: boolean;
  stroke?: string;
  markerStart?: boolean;
  markerEnd?: boolean;
  markerMid?: boolean;
  editable?: boolean;
}

interface IPolylineState {
  hilight: boolean;
}
