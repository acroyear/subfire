import React, { useState } from 'react';
import { CredentialsProvider } from "../../hooks/CredentialsContext";

import LoginCredentials from './LoginCredentials';
import AuthCodeSource from './AuthCodeSource';
import AuthCodeClient from './AuthCodeClient';
import ServerSelect from './ServerSelect';

export default {
  title: 'Credentials/Controls'
};

const Wrapper = props => {
  return <CredentialsProvider>{props.children}</CredentialsProvider>;
};

export const Login_Credentials = props => {
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

export const Server_Select = props => {
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

export const AuthCode_Source = props => {
  return (
    <Wrapper>
      <AuthCodeSource />
    </Wrapper>
  );
};

export const AuthCode_Client = props => {
  return (
    <Wrapper>
      <AuthCodeClient />
    </Wrapper>
  );
};
