import * as React from "react";
import GenericStep from "./GenericStep";
import * as ImageConst from "./imageConst";

import {
  MAIL,
  DOTNET,
  EXCHANGE,
  FILEIMAGE,
  WORD,
  WS,
  XML,
  EXCEL,
  ASCII,
  DB,
  SHAREPOINT,
  CUSTOMFLOBOT
} from "./MapImages";
import {
  MAIL_BPMN,
  DOTNET_BPMN,
  EXCHANGE_BPMN,
  WORD_BPMN,
  WS_BPMN,
  XML_BPMN,
  EXCEL_BPMN,
  ASCII_BPMN,
  DB_BPMN,
  SHAREPOINT_BPMN,
  CUSTOMFLOBOT_BPMN
} from "./MapImages";

const flobot = {
  EMAIL: MAIL,
  ".NET CODE": DOTNET,
  EXCHANGE: EXCHANGE,
  FILE: FILEIMAGE,
  WORD: WORD,
  "WEB SERVICE": WS,
  XML: XML,
  EXCEL: EXCEL,
  ASCII: ASCII,
  DATABASE: DB,
  SHAREPOINT: SHAREPOINT,
  EMAIL_BPMN: MAIL_BPMN,
  ".NET CODE_BPMN": DOTNET_BPMN,
  EXCHANGE_BPMN: EXCHANGE_BPMN,
  FILE_BPMN: FILEIMAGE,
  WORD_BPMN: WORD_BPMN,
  "WEB SERVICE_BPMN": WS_BPMN,
  XML_BPMN: XML_BPMN,
  EXCEL_BPMN: EXCEL_BPMN,
  ASCII_BPMN: ASCII_BPMN,
  DATABASE_BPMN: DB_BPMN,
  SHAREPOINT_BPMN: SHAREPOINT_BPMN,
  custom: CUSTOMFLOBOT,
  custom_BPMN: CUSTOMFLOBOT_BPMN
};

class FlobotStep extends GenericStep {
  componentDidMount() {
    this.calculateTextSize();
  }

  getImage = () => {
    const { FlobotName } = this.props.step;
    const { isBPMNView } = this.props;

    let flobotImage = isBPMNView === true ? FlobotName + "_BPMN" : FlobotName;

    return flobot[flobotImage];
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
          //onMouseDown={this.handleMouseDown}
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

export default FlobotStep;
