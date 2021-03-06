import React from "react";
import { useToggle } from "react-use";
import Switch from "@mui/material/Switch";
import {
  AlbumsBrowser, LoadingCard, Tb1
} from "../..";
import { buildProcessEnvCredentials, SubsonicProvider } from "@subfire/hooks";
export default {
  title: "browsers/AlbumsBrowser",
};

const SubsonicWrapper: React.FC<any> = (props) => {
  console.log(props);
  return (
    <SubsonicProvider
      clientName="SubfireStorybook"
      embeddedCredentials={props.embeddedCredentials}
      LoadingCardComponent={LoadingCard}
    >
      {props.children}
    </SubsonicProvider>
  );
};

const Inner = (_props: any) => {
  const [native, toggleNative] = useToggle(false);
  return (
    <>
      <Switch checked={native} onChange={toggleNative} /><Tb1>Native</Tb1>
      <div>
        <div>
          <AlbumsBrowser native={native} />
        </div>
      </div>
    </>
  );
};

export const AlbumsBrowserDemo = (_props: any) => {
  const credentials = buildProcessEnvCredentials();
  console.warn(credentials);
  return (
    <SubsonicWrapper embeddedCredentials={credentials}>
      <Inner></Inner>
    </SubsonicWrapper>
  );
};
