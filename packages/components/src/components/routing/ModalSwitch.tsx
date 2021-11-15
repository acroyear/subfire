import { Route, Switch, useHistory } from "react-router-dom"
import { LoginCredentials, AuthCodeSource, AuthCodeClient } from "../..";

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