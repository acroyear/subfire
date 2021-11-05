import { AuthCodeClient, AuthCodeSource, LoginCredentials } from '@subfire/components';
import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Pages from './pages';
console.log(Pages.map(p => p.path));
export const Routes = (_props: any) => {
    const history = useHistory();
    return (
        <>
            <Switch>
                {Pages.map(({ path, component = React.Fragment, exact }) => (
                    <Route key={path} path={path} component={component} exact={exact || false} />
                ))}
            </Switch>
            <Switch>
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
        </>
    );
}

