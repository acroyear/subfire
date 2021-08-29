import React from "react";
import { useToggle } from "react-use";
import Switch from "@material-ui/core/Switch";
import {
  SubsonicProvider,
  buildProcessEnvCredentials,
} from "../../hooks/SubsonicContext";
import AlbumsBrowser from "./AlbumsBrowser";
export default {
  title: "browsers/AlbumsBrowser",
};

const SubsonicWrapper: React.FC<any> = (props) => {
  console.warn(props);
  return (
    <SubsonicProvider
      clientName="SubfireStorybook"
      embeddedCredentials={props.embeddedCredentials}
    >
      {props.children}
    </SubsonicProvider>
  );
};

const Inner = (_props: any) => {
  const [native, toggleNative] = useToggle(false);
  return (
    <>
      <Switch checked={native} onChange={toggleNative} />
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
