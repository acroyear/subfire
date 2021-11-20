import { LoaderSwitch, ModalSwitch } from '@subfire/components';
import { useSubsonic } from '@subfire/hooks';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Pages from './pages';
import Headers from './headers';

// console.log(Pages.map(p => p.path));

export const Routes = (_props: any) => {
    const { isLoggedIn } = useSubsonic();
    return (
        <>
            <Switch>
                {Headers.map(({ path, component = React.Fragment, exact }) => (
                    <Route key={path} path={path} component={component} exact={exact || false} />
                ))}
            </Switch>
            {!isLoggedIn && <>Loading...</>}
            {isLoggedIn && <>
                <Switch>
                    {Pages.map(({ path, component = React.Fragment, exact }) => (
                        <Route key={path} path={path} component={component} exact={exact || false} />
                    ))}
                </Switch>
                <LoaderSwitch />
                <ModalSwitch />
            </>}
        </>
    );
}

