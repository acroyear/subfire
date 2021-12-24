import React from "react";
import { HashRouter } from "react-router-dom";
import { LoadingCard, useImageColorTheme, useLoginSnacker } from "@subfire/components";
import { SnackbarProvider, SnackbarKey } from "notistack";
import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.css";
import { Routes } from "./Routes";
import { CredentialsProvider, IntegratedPlayerQueue, SubsonicProvider } from "@subfire/hooks";


const Snacker: React.FC = (props) => {
  useLoginSnacker();
  return <>{props.children}</>;
};

function App() {

  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => {
    notistackRef.current.closeSnackbar(key);
  };
  let { theme } = useImageColorTheme();
  if (!theme) theme = createTheme();
console.log('app rendering');
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
        <SubsonicProvider clientName="SubFireM4" LoadingCardComponent={LoadingCard}>
          <HashRouter>
          <ThemeProvider theme={theme}>
            <Snacker>
              <Routes />
              <IntegratedPlayerQueue />
            </Snacker>
            </ThemeProvider>
          </HashRouter>
        </SubsonicProvider>
      </CredentialsProvider></SnackbarProvider>

  );
}

export default App;
