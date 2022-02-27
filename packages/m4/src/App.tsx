import React from "react";
import { HashRouter } from "react-router-dom";
import { LoadingCard, useImageColorTheme, useLoginSnacker } from "@subfire/components";
import { SnackbarProvider, SnackbarKey } from "notistack";
import { Button, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.css";
import { Layout } from "./Layout";
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
  let { theme, resetTheme, mode, _mode } = useImageColorTheme();
  if (!theme) {
    theme = createTheme({
      palette: {
        mode: 'dark'
      }
    });
    resetTheme();
  }
  console.log('app rendering', mode, _mode, theme.palette.mode);
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
              <Paper className="page-bg">
                <Snacker>
                  <Layout />
                  <IntegratedPlayerQueue />
                </Snacker>
              </Paper>
            </ThemeProvider>
          </HashRouter>
        </SubsonicProvider>
      </CredentialsProvider></SnackbarProvider>

  );
}

export default App;
