import * as queryString from "query-string";
import MapView from "../containers/MapView";
import * as React from "react";
import Toolbar from "./Toolbar";
import { IParam } from "../interface/map";

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    const qs = queryString.parse(this.props.location.search);

    let parser = document.createElement("a");
    parser.href = window.location.href;

    this.state = {
      params: {
        editable: qs.editable === "true",
        isBPMNView: qs.isBPMNView === "true",
        processName: qs.processName,
        incident: qs.incident,
        version: qs.version,
        bpmServer: qs.bpmServer,
        serverId: qs.serverId,
        language: qs.language,
        hostName: parser.hostname,
        protocol: parser.protocol,
        port: parser.port
      }
    };
  }

  public render() {
    const { params } = this.state;
    console.log(params);

    return params.editable === true ? (
      <React.Fragment>
        <Toolbar />
        <MapView params={params} />
      </React.Fragment>
    ) : (
      <MapView params={params} />
    );
  }
}

export default App;

interface IAppProps {
  history: any;
  location: any;
  match: any;
}

interface IAppState {
  params: IParam;
}
