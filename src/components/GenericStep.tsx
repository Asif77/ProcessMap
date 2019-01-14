import * as React from "react";
import * as ImageConst from "./imageConst";
import * as d3 from "d3";
import { Step, StepContext } from "../interface/map";

import {
  StepState,
  TaskStatuses,
  TaskSubStatuses,
  RecipientTypes
} from "./constant";
import {
  ACTIVE,
  COMPLETED_HALF,
  REASSIGN,
  CONFER_LATE,
  INQUEUE,
  COMPLETED,
  ACTIVE_RETURNED,
  FAILED,
  CONFER,
  RESUBMITTED,
  OVERDUE,
  URGENT,
  RETURNED,
  ABORTED,
  SKIP,
  DELAY,
  UNRULY,
  WARNING
} from "./MapImages";

export default class GenericStep extends React.Component<IStepProps, any> {
  public static defaultProps: any;
  constructor(props: IStepProps) {
    super(props);

    this.state = {
      textSize: null
    };
  }

  getBPMNStartX = () => {
    const { Location } = this.props.step;

    let x = Location.X - ImageConst.CX;

    return x;
  };

  getBPMNStartY = () => {
    const { Location } = this.props.step;

    let y = Location.Y + (ImageConst.CY - ImageConst.IMAGEHEIGHT) / 2.0;

    return y;
  };

  getStateImageX = () => {
    const { Location } = this.props.step;

    let x = Location.X + ImageConst.CX / 2;
    x +=
      (ImageConst.CX + Location.X - x) / 2.0 -
      (ImageConst.STATEIMAGEWIDTH >> 1);

    return x;
  };

  getStateImageY = () => {
    const { Location } = this.props.step;

    let y = Location.Y - (ImageConst.STATEIMAGEHEIGHT >> 1);

    return y < 0 ? 0 : y;
  };

  getImageX = () => {
    const { Location } = this.props.step;

    return Location.X + (ImageConst.CX - ImageConst.IMAGEWIDTH) / 2.0;
  };

  getImageY = () => {
    const { Location } = this.props.step;

    return Location.Y + (ImageConst.CY - ImageConst.IMAGEHEIGHT) / 2.0;
  };

  getTextX = () => {
    const { Location } = this.props.step;
    const { textSize } = this.state;
    let textX = Location.X;
    if (textSize !== null) {
      if (ImageConst.CX < textSize.width)
        textX -= (textSize.width - ImageConst.CX) / 2.0;
      else textX += (ImageConst.CX - textSize.width) / 2.0;
    }

    return textX;
  };

  getTextWidth = () => {
    const { textSize } = this.state;

    if (textSize !== null) return textSize.width;

    return 0;
  };

  getTextY = () => {
    const { Location } = this.props.step;
    const { textSize } = this.state;

    return textSize !== null
      ? Location.Y + ImageConst.CY + textSize.height
      : Location.Y;
  };

  calculateTextSize = () => {
    let selection = d3.select(this.refs.text);
    let size = selection.node().getBBox();

    this.setState({ textSize: size });
  };

  getPropAsString(source: any, value: number) {
    let keys = Object.keys(source);

    let curIndex, total, foundKey;

    for (curIndex = 0, total = keys.length; curIndex < total; curIndex++) {
      let curKey = keys[curIndex];
      if (source[curKey] === value) {
        foundKey = curKey;
        break;
      }
    }

    return foundKey;
  }

  isEqual = (s: number, d: number) => {
    return s === d;
  };

  handleMouseOver = (e: any) => {
    if (this.props.stepContext) {
      const {
        RecipientType,
        strRecipient,
        StepLabel,
        ListTaskStatus,
        ListTaskSubStatus,
        ListAssignedToUserNames,
        ListAssignedToUserFullNames
      } = this.props.stepContext;

      const { editable, translation, localizedName } = this.props;

      if (editable === true) return;

      if (strRecipient) {
        let title: string = localizedName === "" ? StepLabel : localizedName;
        let description: string = "";
        if (ListTaskStatus && ListTaskStatus.length > 0) {
          if (strRecipient === "SYSTEMUSER") {
            let found: boolean = false;
            ListAssignedToUserNames.forEach((name: string) => {
              if (name === strRecipient) found = true;
            });
            if (found)
              description =
                strRecipient +
                " (" +
                this.getPropAsString(
                  StepState,
                  this.GetStepState(ListTaskStatus[0], ListTaskSubStatus[0])
                ) +
                ")";
            else
              description =
                ListAssignedToUserNames[0] +
                " (" +
                this.getPropAsString(
                  StepState,
                  this.GetStepState(ListTaskStatus[0], ListTaskSubStatus[0])
                ) +
                ")";
          } else {
            if (
              this.isEqual(RecipientType, RecipientTypes.Group) ||
              this.isEqual(RecipientType, RecipientTypes.GroupSequential) ||
              this.isEqual(RecipientType, RecipientTypes.GroupWeighted) ||
              this.isEqual(RecipientType, RecipientTypes.Que) ||
              this.isEqual(RecipientType, RecipientTypes.ChartName) ||
              this.isEqual(RecipientType, RecipientTypes.Job)
            ) {
              description += strRecipient + "<br>";
            }
            ListAssignedToUserFullNames.forEach((name: string, i: number) => {
              let str: string = name;
              if (name === null || name === "") {
                str = ListAssignedToUserNames[i];
              }
              description +=
                str +
                " (" +
                this.getPropAsString(
                  StepState,
                  this.GetStepState(ListTaskStatus[i], ListTaskSubStatus[0])
                ) +
                ")" +
                "<br>";
            });
          }
        }

        let tooltipDiv = document.getElementById("tooltip");
        if (tooltipDiv !== null) {
          tooltipDiv.innerHTML = `<p class='title'>${title}</p><hr><p class='description'>${description}</p>`;
          tooltipDiv.style.top =
            (this.getImageY() + 64) * translation.scaleFactor +
            translation.y +
            "px";
          tooltipDiv.style.left =
            this.getImageX() * translation.scaleFactor + translation.x + "px";

          // let x =
          //   64 +
          //   (this.getImageX() * translation.scaleFactor + translation.x) * -2;
          //let xp = `translateX(${x.toString()}px)`;
          //tooltipDiv.style.transform = "translateX(150px)";
          //tooltipDiv.style.transform = xp;
          tooltipDiv.style.display = "block";
        }
      }
    }
  };

  handleMouseOut = (e: any) => {
    const tooltipDiv: HTMLElement | null = document.getElementById("tooltip");
    if (tooltipDiv !== null) tooltipDiv.style.display = "none";
  };

  getStateImage = () => {
    if (this.props.stepContext) {
      const { ListTaskStatus, ListTaskSubStatus } = this.props.stepContext;
      if (ListTaskStatus && ListTaskStatus.length > 0) {
        return this.GetStatusImage(
          this.GetStepState(ListTaskStatus[0], ListTaskSubStatus[0])
        );
      }
    }

    return null;
  };

  GetStepState = (status: number, substatus: number) => {
    let URGENT = TaskSubStatuses.TASK_STATUS_ACTIVE_LATE;
    let URGENT_CONFERED = URGENT | TaskSubStatuses.TASK_STATUS_ACTIVE_CONFERED;
    let URGENT_RETURNED = URGENT | TaskSubStatuses.TASK_STATUS_ACTIVE_RETURNED;
    let URGENT_REASSIGNED =
      URGENT | TaskSubStatuses.TASK_STATUS_ACTIVE_REASSIGNED;
    let URGENT_RESUBMITTED =
      URGENT | TaskSubStatuses.TASK_STATUS_ACTIVE_RESUBMITTED;

    let OVERDUE = TaskSubStatuses.TASK_STATUS_ACTIVE_OVERDUE;
    let OVERDUE_CONFERED =
      OVERDUE | TaskSubStatuses.TASK_STATUS_ACTIVE_CONFERED;
    let OVERDUE_RETURNED =
      OVERDUE | TaskSubStatuses.TASK_STATUS_ACTIVE_RETURNED;
    let OVERDUE_REASSIGNED =
      OVERDUE | TaskSubStatuses.TASK_STATUS_ACTIVE_REASSIGNED;
    let OVERDUE_RESUBMITTED =
      OVERDUE | TaskSubStatuses.TASK_STATUS_ACTIVE_RESUBMITTED;

    if (status === TaskStatuses.TASK_STATUS_ACTIVE) {
      if (this.ContainsBits(substatus, URGENT_REASSIGNED))
        return StepState.ReassignedLate;
      if (this.ContainsBits(substatus, OVERDUE_REASSIGNED))
        return StepState.ReassignedOverDue;
      if (
        this.ContainsBits(
          substatus,
          TaskSubStatuses.TASK_STATUS_ACTIVE_REASSIGNED
        )
      )
        return StepState.Reassigned;

      if (this.ContainsBits(substatus, URGENT_RETURNED))
        return StepState.ReturnedLate;
      if (this.ContainsBits(substatus, OVERDUE_RETURNED))
        return StepState.ReturnedOverDue;
      if (
        this.ContainsBits(
          substatus,
          TaskSubStatuses.TASK_STATUS_ACTIVE_RETURNED
        )
      )
        return StepState.ActiveReturned;

      if (this.ContainsBits(substatus, URGENT_CONFERED))
        return StepState.ConferredLate;
      if (this.ContainsBits(substatus, OVERDUE_CONFERED))
        return StepState.ConferredOverDue;
      if (
        this.ContainsBits(
          substatus,
          TaskSubStatuses.TASK_STATUS_ACTIVE_CONFERED
        )
      )
        return StepState.Conferrred;

      if (this.ContainsBits(substatus, URGENT_RESUBMITTED))
        return StepState.ResubmittedLate;
      if (this.ContainsBits(substatus, OVERDUE_RESUBMITTED))
        return StepState.ResubmittedOverDue;
      if (
        this.ContainsBits(
          substatus,
          TaskSubStatuses.TASK_STATUS_ACTIVE_RESUBMITTED
        )
      )
        return StepState.Resubmitted;

      if (this.ContainsBits(substatus, URGENT)) return StepState.Urgent;
      if (this.ContainsBits(substatus, OVERDUE)) return StepState.Overdue;

      return StepState.Active;
    }
    if (status === TaskStatuses.TASK_STATUS_COMPLETED) {
      if (
        this.ContainsBits(
          substatus,
          TaskSubStatuses.TASK_STATUS_COMPLETE_INCIDENT_COMPLETE
        )
      )
        return StepState.CompletedIncComp;

      return StepState.Completed;
    }
    if (status === TaskStatuses.TASK_STATUS_ABORTED) return StepState.Aborted;
    if (status === TaskStatuses.TASK_STATUS_DELAYED) return StepState.Delay;
    if (status === TaskStatuses.TASK_STATUS_FAILED) return StepState.Failed;
    if (status === TaskStatuses.TASK_STATUS_INQUEUE) {
      if (this.ContainsBits(substatus, URGENT)) return StepState.InQueueLate;
      if (this.ContainsBits(substatus, OVERDUE))
        return StepState.InQueueOverDue;
      return StepState.InQueue;
    }
    if (status === TaskStatuses.TASK_STATUS_REJECTED) return StepState.Returned;
    if (status === TaskStatuses.TASK_STATUS_SKIPPED) return StepState.Skipped;
    return StepState.None;
  };

  ContainsBits = (source: number, flages: number) => {
    return (source & flages) === flages;
  };

  GetStatusImage = (state: number) => {
    let img;
    switch (state) {
      case StepState.Active:
        img = ACTIVE;
        break;
      case StepState.Reassigned:
        img = REASSIGN;
        break;
      case StepState.Conferrred:
        img = CONFER;
        break;
      case StepState.Overdue:
        img = OVERDUE;
        break;
      case StepState.ActiveResubmitted:
      case StepState.Resubmitted:
        img = RESUBMITTED;
        break;
      case StepState.Urgent:
        img = URGENT;
        break;
      case StepState.Returned:
        img = RETURNED;
        break;
      case StepState.ReassignedLate:
        img = URGENT;
        break;
      case StepState.ReassignedOverDue:
        img = OVERDUE;
        break;
      case StepState.ConferredLate:
        img = CONFER_LATE;
        break;
      case StepState.ConferredOverDue:
        img = OVERDUE;
        break;
      case StepState.ResubmittedLate:
        img = URGENT;
        break;
      case StepState.ResubmittedOverDue:
        img = OVERDUE;
        break;
      case StepState.ReturnedLate:
        img = URGENT;
        break;
      case StepState.ReturnedOverDue:
        img = OVERDUE;
        break;
      case StepState.InQueue:
        img = INQUEUE;
        break;
      case StepState.InQueueLate:
        img = URGENT;
        break;
      case StepState.InQueueOverDue:
        img = OVERDUE;
        break;
      case StepState.Completed:
        img = COMPLETED_HALF;
        break;

      case StepState.CompletedIncComp:
        img = COMPLETED;
        break;
      case StepState.Aborted:
        img = ABORTED;
        break;
      case StepState.Failed:
        img = FAILED;
        break;
      case StepState.Resubmitable:
        img = REASSIGN;
        break;
      case StepState.Unruly:
        img = UNRULY;
        break;
      case StepState.Warning:
        img = WARNING;
        break;
      case StepState.Delay:
        img = DELAY;
        break;
      case StepState.Skipped:
        img = SKIP;
        break;
      case StepState.ActiveReturned:
        img = ACTIVE_RETURNED;
        break;
      case StepState.None:
      default:
        return null;
    }

    return img;
  };
}

GenericStep.defaultProps = {
  height: 40,
  onMouseDown: Function.prototype,
  //onMouseMove: Function.prototype,
  selected: false,
  selectedColor: "tomato",
  selectStep: Function.prototype,
  stopDragging: Function.prototype,
  showStepProps: Function.prototype,
  stopPropagation: (event: any) => {
    event.stopPropagation();
  },
  style: {
    fill: "white",
    fontSize: 14,
    stroke: "gray",
    strokeWidth: 2
  },
  x: 100,
  y: 100,
  width: 100
};

interface IStepProps {
  key: string;
  step: Step;
  localizedName: string;
  isBPMNView: boolean;
  stepContext: StepContext;
  selectStep: any;
  stopDragging: any;
  editable: boolean;
  translation: any;
  showStepProps: any;
}
