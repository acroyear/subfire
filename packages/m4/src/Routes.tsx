import { LoaderSwitch, ModalSwitch } from '@subfire/components';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Pages from './pages';
// console.log(Pages.map(p => p.path));

export const Routes = (_props: any) => {
    return (
        <>
            <Switch>
                {Pages.map(({ path, component = React.Fragment, exact }) => (
                    <Route key={path} path={path} component={component} exact={exact || false} />
                ))}
            </Switch>
            <LoaderSwitch />
            <ModalSwitch />
        </>
    );
}

