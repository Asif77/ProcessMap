import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as mapActions from "../actions/mapViewActions";
import * as navActions from "../actions/navActions";
import "./Toolbar.css";
import { USER_STEP, JUNCTION } from "./MapImages";
import { mapObjectSelection } from "./constant";

class Toolbar extends React.Component<any> {
  onMouseDown = (event: any) => {
    // let header: HTMLElement | null = document.getElementById("toolbarButtonDiv");
    // if (header != null)
    // {
    //     var btns = header.getElementsByClassName("mat-button-toggle-label-content");
    //     for (var i = 0; i < btns.length; i++) {
    //         btns[i].addEventListener("click", function() {
    //             var current = document.getElementsByClassName("mat-button-toggle-checked");
    //             current[0].className = current[0].className.replace(" mat-button-toggle-checked", "");
    //             this.className += " mat-button-toggle-checked";
    //         });
    //     }
    // }
    // const { nav } = this.props;
    // let checked = document.getElementById("mousePointer");
    // nav.selection = checked.className === "mat-button-toggle-label-content mat-button-toggle-checked" ? 1 : 2;
  };

  selectMousePointer = () => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("mousePointer");
    if (element != null) element.className += " mat-button-toggle-checked";
  };

  onMousePointerClicked = (event: any) => {
    this.selectMousePointer();
    this.setNavSelectiom(mapObjectSelection.Pointer);
  };

  onLinkedClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("link");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.Link);
  };

  onUserStepClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("userStep");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.User);
  };

  onJunctionStepClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("junctionStep");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.Junction);
  };

  onPublishMapClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("publishMap");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.PublishMap);

    const { map } = this.props;

    this.props.actions.mapActions.saveMap(map);

    setTimeout(() => {
      this.setNavSelectiom(mapObjectSelection.Pointer);
    }, 1000);
  };

  onNewMapClicked = (event: any) => {
    unSelectButton();

    let element: HTMLElement | null = document.getElementById("newMap");
    if (element != null) element.className += " mat-button-toggle-checked";

    this.setNavSelectiom(mapObjectSelection.NewMap);
  };

  setNavSelectiom = (sel: any) => {
    const { nav } = this.props;

    if (nav !== sel) {
      this.props.actions.navActions.navSelection(sel);
    }
  };

  render() {
    return (
      <nav id="header" className="header noselect">
        <a className="logo white">Ultimus</a>
        <div
          id="toolbarButtonDiv"
          className="navbar-header mat-button-toggle-group mat-button-toggle-standalone"
        >
          <div
            id="mousePointer"
            className="mat-button-toggle-label-content mat-button-toggle-checked"
            onClick={this.onMousePointerClicked}
          >
            <i className="fa fa-mouse-pointer" />
          </div>
          <div
            id="newMap"
            className="mat-button-toggle-label-content"
            onClick={this.onNewMapClicked}
          >
            <i className="fa fa-file" />
          </div>
          <div
            id="link"
            className="mat-button-toggle-label-content"
            onClick={this.onLinkedClicked}
          >
            <i className="fa fa-link" />
          </div>
          <div
            id="userStep"
            className="mat-button-toggle-label-content"
            onClick={this.onUserStepClicked}
          >
            <img src={USER_STEP} width="24" height="24" alt="" />
          </div>
          <div
            id="junctionStep"
            className="mat-button-toggle-label-content"
            onClick={this.onJunctionStepClicked}
          >
            <img src={JUNCTION} width="24" height="24" alt="" />
          </div>
          <div
            id="publishMap"
            className="mat-button-toggle-label-content"
            onClick={this.onPublishMapClicked}
          >
            <i className="fa fa-globe" />
          </div>
        </div>
      </nav>
    );
  }
}

const unSelectButton = () => {
  var current = document.getElementsByClassName("mat-button-toggle-checked");
  for (var i = 0; i < current.length; i++) {
    current[i].className = current[i].className.replace(
      " mat-button-toggle-checked",
      ""
    );
  }
};

const setSelection = (sel: any) => {
  unSelectButton();
  let element = null;
  switch (sel) {
    case mapObjectSelection.User:
      element = document.getElementById("userStep");
      break;
    case mapObjectSelection.Junction:
      element = document.getElementById("junctionStep");
      break;
    case mapObjectSelection.Link:
      element = document.getElementById("link");
      break;
    case mapObjectSelection.Pointer:
      element = document.getElementById("mousePointer");
      break;
    case mapObjectSelection.PublishMap:
      element = document.getElementById("publishMap");
      break;
    case mapObjectSelection.NewMap:
      element = document.getElementById("newMap");
      break;
    default:
      element = document.getElementById("mousePointer");
      break;
  }

  if (element !== null) element.className += " mat-button-toggle-checked";
};

const mapStateToProps = (state: any, ownProps: any) => {
  setSelection(state.nav);
  return {
    map: state.data.map,
    nav: state.nav
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: {
      mapActions: bindActionCreators(mapActions, dispatch),
      navActions: bindActionCreators(navActions, dispatch)
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
