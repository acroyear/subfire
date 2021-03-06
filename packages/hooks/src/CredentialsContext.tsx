import React, { createContext, useContext } from 'react';
import { useLocalStorage } from "react-use";
import { v4 as uuidv4 } from "uuid";
import {Merge, MergeExclusive} from 'type-fest';

interface SCBaseline {
  name: string,
  server: string,
  username: string,
  bitrate: string,
  clientName?: string
};

interface SCPassword {
  password: string
};

interface SCToken {
  seed: string, token: string
}

export type SubfireCredentials = Merge<SCBaseline, MergeExclusive<SCPassword, SCToken>>;

interface SubfireCredentialsCollection {
  [key: string]: SubfireCredentials
}

export interface SubfireCredentialsSet {
  creds: SubfireCredentialsCollection,
  current: string
}

function createDemo(): SubfireCredentialsSet {
  const SubFireDemo: SubfireCredentials = {
    name: "SubFire Demo",
    server: "https://subfiresuite.com/ampache",
    username: "guest",
    password: "guest1",
    bitrate: "0",
  };
  const demo = uuidv4();
  const creds = {} as SubfireCredentialsCollection;
  creds[demo] = SubFireDemo;
  return {
    creds: creds,
    current: demo,
  };
}

export type CredentialsContextContent = [
  SubfireCredentials,
  SubfireCredentialsCollection,
  string,
  (current: string) => void,
  (key: string, update: SubfireCredentials) => void,
  (current: string) => void,
  (newCreds: SubfireCredentialsCollection) => void
];

export function useCredentialsStorage(): CredentialsContextContent {
  const [creds, setCreds] = useLocalStorage(
    "subsonic.credentials",
    createDemo()
  );

  function setCurrent(current: string) {
    creds.current = current;
    setCreds({ ...creds });
  }

  const current = creds.creds[creds.current];

  function updateCreds(key: string, update: SubfireCredentials) {
    if (!key || key === "__new__") {
      key = uuidv4();
      delete creds.creds["__new__"]; // clean up the mess from 3.0
    }
    creds.creds[key] = update;
    creds.current = key;
    setCreds({ ...creds });
  }

  function deleteCreds(key: string) {
    delete creds.creds[key];
    setCreds({ ...creds });
  }

  // for credentials link-up
  function importCreds(newCreds: SubfireCredentialsCollection) {
    const mergedCreds = { ...creds, ...newCreds };
    setCreds(mergedCreds);
  }

  return [
    current,
    creds.creds,
    creds.current,
    setCurrent,
    updateCreds,
    deleteCreds,
    importCreds,
  ];
}

export const CredentialsContext = createContext(null);
export const CredentialsProvider: React.FC = ({ children }) => (
  <CredentialsContext.Provider value={useCredentialsStorage()}>
    {children}
  </CredentialsContext.Provider>
);

export const useCredentials = () => useContext<CredentialsContextContent>(CredentialsContext);

