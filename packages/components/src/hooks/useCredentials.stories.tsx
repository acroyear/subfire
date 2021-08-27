import React from 'react';
import { useCredentialsStorage, useCredentials, CredentialsProvider } from './CredentialsContext';

export default {
  title: 'hooks/useCredentials'
};

export const Current: React.FC<any> = props => {
  const [current] = useCredentialsStorage();
  return <span>{JSON.stringify(current)}</span>;
};

const StageMe: React.FC<any> = props => {
  const { current, creds, currentKey, setCurrent } = props;
  const toggleMe = () => {
    if (currentKey === '767248d0-7236-441d-959c-90f9e44e4aa2') {
      setCurrent('7f36e741-b267-4167-9556-6dfc72c4608d');
    } else {
      setCurrent('767248d0-7236-441d-959c-90f9e44e4aa2');
    }
  };

  return <span onClick={toggleMe}>{JSON.stringify(current)}</span>;
};

export const Simultaneous: React.FC<any> = props => {
  const [current, creds, currentKey, setCurrent] = useCredentialsStorage();
  const theProps = { current, creds, currentKey, setCurrent };
  return (
    <>
      <StageMe {...theProps} />
      <hr />
      <StageMe {...theProps} />
    </>
  );
};

const Wrapper: React.FC<any> = props => {
  return <CredentialsProvider>{props.children}</CredentialsProvider>;
};

const Inner: React.FC<any> = props => {
  const value = useCredentials() || [];
  const [current, creds, currentKey, setCurrent] = value;

  const toggleMe = () => {
    if (currentKey === '767248d0-7236-441d-959c-90f9e44e4aa2') {
      setCurrent('7f36e741-b267-4167-9556-6dfc72c4608d');
    } else {
      setCurrent('767248d0-7236-441d-959c-90f9e44e4aa2');
    }
  };

  return <span onClick={toggleMe}>{JSON.stringify(current)}</span>;
};

export const ContextDemo: React.FC<any> = props => {
  return (
    <Wrapper>
      <div>
        <div>
          <Inner />
          <hr />
          <Inner />
        </div>
      </div>
    </Wrapper>
  );
};
