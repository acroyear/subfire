import React, { useState } from 'react';
import { CredentialsProvider } from '@subfire/hooks';
import { LoginCredentials, AuthCodeSource, AuthCodeClient, ServerSelect } from "../..";

export default {
  title: 'Credentials/State'
};

const Wrapper = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
  return <CredentialsProvider>{props.children}</CredentialsProvider>;
};

export const InContext = (props: any) => {
  const [isShowingLogin, setShowingLogin] = useState(false);
  const [isShowingAuthClient, setAuthClient] = useState(false);
  const [isShowingAuthSource, setAuthSource] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <Wrapper>
      {isShowingLogin && (
        <LoginCredentials
          handleClose={() => {
            setShowingLogin(false);
          }}
        />
      )}
      {isShowingAuthSource && (
        <AuthCodeSource
          handleClose={() => {
            setAuthSource(false);
          }}
        />
      )}
      {isShowingAuthClient && (
        <AuthCodeClient
          handleClose={() => {
            setAuthClient(false);
          }}
        />
      )}
      <ServerSelect isLoggedIn={isLoggedIn} />
      <button
        onClick={() => {
          setLoggedIn(!isLoggedIn);
        }}
      >
        Toggle Logged In
      </button>
      <button onClick={() => setShowingLogin(true)}>Credentials</button>
      <button onClick={() => setAuthSource(true)}>Auth Source</button>
      <button onClick={() => setAuthClient(true)}>Auth Client</button>
    </Wrapper>
  );
};
