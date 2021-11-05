import React from "react";
import { HashRouter } from "react-router-dom";
import { SubsonicProvider, CredentialsProvider, useLoginSnacker } from "@subfire/components";
import { SnackbarProvider, SnackbarKey } from "notistack";
import { Button } from "@mui/material";

import "./App.css";
import { Routes } from "./Routes";


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
          <HashRouter>
            <Snacker>
              <Routes />
            </Snacker>
          </HashRouter>
        </SubsonicProvider>
      </CredentialsProvider></SnackbarProvider>

  );
}

export default App;
