import React from 'react';
import { ComponentType } from 'react';
import { Route, Switch, SwitchProps } from 'react-router';

export interface PageRouteData {
    path: string;
    component: ComponentType;
    exact: boolean;
}

export interface PageSwitchProps extends SwitchProps {
    pages: Array<PageRouteData>;
}

export const PageSwitch = (props: PageSwitchProps) => {
    const { pages, ...rest } = props;
    return (<Switch {...rest}>
        {pages.map(({ path, component = React.Fragment, exact }) => (
            <Route key={path} path={path} component={component} exact={exact || false} />
        ))}
    </Switch>);
}