import React, { useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { SnackbarProvider, SnackbarKey } from "notistack";
import { Button, PaletteMode, PaletteOptions, Paper } from "@mui/material";
import { ThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";

import { CredentialsProvider, IntegratedPlayerQueue, SubsonicProvider } from "@subfire/hooks";
import { useLoginSnacker } from "../../hooks/useLoginSnacker";
import { AdjustableThemeProvider, SubFirePaletteMode, useAdjustableImagePalette, useAdjustableThemeColors, useAdjustableThemeDark, useAdjustableThemeMaterialPalette } from "../../hooks/useAdjustableTheme";
import { LoadingCard } from "../ui/loader/LoadingCard";

const Snacker: React.FC = (props) => {
  useLoginSnacker();
  return <>{props.children}</>;
};

export interface AppProps {
  paletteOptions?: PaletteOptions;
  darkMode?: SubFirePaletteMode;
  materialPalette?: boolean;

  Contents: React.ComponentType;
  clientName: string;
}

export const SubFireApp = (props: AppProps) => {
  const { paletteOptions, darkMode, materialPalette, Contents, clientName } = props;
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => {
    notistackRef.current.closeSnackbar(key);
  };

  const [_mode, setDarkMode] = useAdjustableThemeDark();
  const [_material, setMaterial] = useAdjustableThemeMaterialPalette();
  const [_paletteOptions, setPaletteOptions] = useAdjustableThemeColors();

  useEffect(() => {
    setPaletteOptions(() => paletteOptions);
  }, [paletteOptions]);

  useEffect(() => {
    setMaterial(() => materialPalette);
  }, [materialPalette]);

  useEffect(() => {
    setDarkMode(() => darkMode);
  }, [darkMode]);

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
        <SubsonicProvider clientName={clientName} LoadingCardComponent={LoadingCard}>
          <HashRouter>
            <AdjustableThemeProvider>
              <Paper className="page-bg">
                <Snacker>
                  <Contents />
                  <IntegratedPlayerQueue />
                </Snacker>
              </Paper>
            </AdjustableThemeProvider>
          </HashRouter>
        </SubsonicProvider>
      </CredentialsProvider></SnackbarProvider>
  );
}

export default SubFireApp;
