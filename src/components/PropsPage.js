import React, { Component } from "react";
import "./PropsPage.css";
import * as ImageConst from "./imageConst";

class PropsPage extends Component {
  render() {
    const { step, closeStepProps, onChange } = this.props;

    let leftn = step ? step.Location.X + ImageConst.IMAGEWIDTH : "100px";
    let topn = step ? step.Location.Y + ImageConst.IMAGEHEIGHT : "10px";

    let left = leftn.toString() + "px";
    let top = topn.toString() + "px";

    const propsPageStyle = {
      position: "absolute",
      width: "220px",
      top: top,
      left: left,
      padding: "0px 5px 6px 5px",
      fontFamily: "&quot;Lucida Grande&quot;, sans-serif",
      fontSize: "11px"
    };

    const controlsParentStyle = { overflow: "hidden", marginTop: "10px" };

    const lableStyle = {
      float: "left",
      width: "75px",
      padding: "3px",
      color: "#b8b8b8"
    };

    const inputParentStyle = { float: "left", marginRight: "5px" };

    const inputStyle = {
      background: "#e1e1e1",
      borderWidth: "0",
      padding: "3px 5px",
      color: "gray",
      borderRadius: "3px",
      width: "100px",
      outline: "none"
    };

    const parentDivStyle = {
      backgroundColor: "#f1f1f1",
      overflow: "hidden",
      paddingBottom: "12px",
      paddingTop: "12px",
      paddingLeft: "10px",
      border: "0px solid #d3d3d3",
      marginBottom: "5px"
    };

    return (
      <div style={propsPageStyle}>
        <div style={parentDivStyle}>
          <span className="close noselect" onClick={closeStepProps}>
            X
          </span>
          <h6 className="noselect">{step ? step.Name : ""}</h6>
          <div style={controlsParentStyle}>
            <div className="noselect" style={lableStyle}>
              RecipientType
            </div>
            <div style={inputParentStyle}>
              <input
                style={inputStyle}
                name="StepRecipientType"
                value={
                  step && step.StepRecipientType ? step.StepRecipientType : ""
                }
                onChange={onChange}
              />
            </div>
          </div>
          <div style={controlsParentStyle}>
            <div className="noselect" style={lableStyle}>
              Recipient
            </div>
            <div style={inputParentStyle}>
              <input
                style={inputStyle}
                name="StepRecipient"
                value={step && step.StepRecipient ? step.StepRecipient : ""}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PropsPage;
