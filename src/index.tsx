import * as React from "react";
import { render } from "react-dom";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import "./styles/styles.css"; //Webpack can import CSS files too!
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Router } from "react-router";
import routes from "./routes";
import browserHistory from "history/createBrowserHistory";

const store = configureStore();
const history = browserHistory();

render(
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>,
  document.getElementById("root")
);
/*
store.subscribe(()=>{
  const state = store.getSate();
  if (state.map.length > 0)
  {
    console.info("Mounting app");
    render(
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  }
  else {
    console.info("App not yet mounting");
  }
});
*/

//ReactDOM.render(<App map={map} />, document.getElementById('root'));
//registerServiceWorker();

// "extends": ["tslint:recommended", "tslint-react", "tslint-config-prettier"],
