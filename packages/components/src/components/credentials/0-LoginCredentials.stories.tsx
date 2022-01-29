import React, { useState } from 'react';
import { CredentialsProvider } from '@subfire/hooks';
import { LoginCredentials, AuthCodeSource, AuthCodeClient, ServerSelect } from "../..";

export default {
  title: 'Credentials/Controls'
};

const Wrapper = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
  return <CredentialsProvider>{props.children}</CredentialsProvider>;
};

export const Login_Credentials = (props: any) => {
  return (
    <Wrapper>
      <LoginCredentials
        handleClose={() => {
          console.log('closing');
        }}
      />
    </Wrapper>
  );
};

export const Server_Select = (props: any) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <Wrapper>
      <ServerSelect isLoggedIn={isLoggedIn} />
      <button
        onClick={() => {
          setLoggedIn(!isLoggedIn);
        }}
      >
        Toggle Logged In
      </button>
    </Wrapper>
  );
};

export const AuthCode_Source = (props: any) => {
  return (
    <Wrapper>
      <AuthCodeSource />
    </Wrapper>
  );
};

export const AuthCode_Client = (props: any) => {
  return (
    <Wrapper>
      <AuthCodeClient />
    </Wrapper>
  );
};
