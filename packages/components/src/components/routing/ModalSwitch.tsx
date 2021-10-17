import { Route, Switch, useHistory } from "react-router-dom"
import AuthCodeClient from "../credentials/AuthCodeClient";
import AuthCodeSource from "../credentials/AuthCodeSource";
import LoginCredentials from "../credentials/LoginCredentials";

export const ModalSwitch = () => {
    const history = useHistory();
    return <Switch>
        <Route path="/login">
            <LoginCredentials handleClose={history.goBack} />
        </Route>
        <Route path="/linkSource">
            <AuthCodeSource handleClose={history.goBack} />
        </Route>
        <Route path="/linkClient">
            <AuthCodeClient handleClose={history.goBack} />
        </Route>
    </Switch>
};

export default ModalSwitch;

/*
    <Route path="/remoteConfig">
      <RemoteConfigScreen handleClose={history.goBack} />
    </Route>
    <Route path="/remoteControl">
      <RemoteControl handleClose={history.goBack} />
    </Route>
    */