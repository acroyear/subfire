import React, { ComponentType } from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import { SubsonicProvider, CredentialsProvider, useLoginSnacker } from "@subfire/components";
import { SnackbarProvider, SnackbarKey } from "notistack";
import { Button } from "@mui/material";

import "./App.css";
import Pages from './pages';
const Routes = Pages as any;
console.log(Routes);
const routes = Object.keys(Routes).map((route) => {
  console.log(route);
  const path = '/' + route
    .replace(/\/src\/pages|index|\.tsx$/g, '')
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1')

  return { path, component: Routes[route] as ComponentType }
})

const Snacker: React.FC = (props) => {
  useLoginSnacker();
  return <>{props.children}</>;
};

function App() {

  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      action={(key) => (
        <Button
          style={{ color: "#ffffff" }}
          size="small"
          onClick={() => onClickDismiss(key)}
        >
          Dismiss
        </Button>
      )}
    >
      <CredentialsProvider>
        <SubsonicProvider clientName="SubFireM4">
          <HashRouter><Snacker>
            <Switch>
              {routes.map(({ path, component = React.Fragment }) => (
                <Route key={path} path={path} component={component} exact={false} />
              ))}
            </Switch></Snacker>
          </HashRouter>
        </SubsonicProvider>
      </CredentialsProvider></SnackbarProvider>

  );
}

export default App;
