import { Subsonic, SubsonicLoader, SubsonicTypes } from "@subfire/core";
import { useSubsonicQueue, useSubsonicLoader } from "@subfire/hooks";
import { Redirect, Route, Switch, useHistory, useLocation, useParams } from "react-router-dom";
import { SubfireRouterParams } from "../..";

export interface RouteLoaderProps {
    targetRoute?: string;
    remoteRoute?: string;
}

export const RoutePlayerLoader = ({ targetRoute = "/player", remoteRoute = "/remoteControl" }: RouteLoaderProps) => {
    const params = useParams<SubfireRouterParams>();
    const { id, type, mode } = params;
    const o = Subsonic.constructFakeObject(type, id);
    const {
        state, card, result, error
    } = useSubsonicLoader<SubsonicTypes.SongList>(() => SubsonicLoader(params), o);
    const { set } = useSubsonicQueue();

    console.log(card, result, error, state);
    if (card) return (<>{card}</>);
    if (error) return <p>{JSON.stringify(error)}</p>;
    set(result, result.current || 0, result.position || 0, result.name || 'Current Queue', { ...params, bookmarkSource: result.name || 'currentQueue' });

    return <Redirect to={targetRoute} />;
}

export const LoaderSwitch = ({ targetRoute = "/player", remoteRoute = "/remoteControl" }: RouteLoaderProps) => {
    return (
        <Switch>
            <Route path="/load(ing)/:type/:id/:mode?" exact={true} strict={true}>
                <div className="page-bg" />
                <RoutePlayerLoader targetRoute={targetRoute} remoteRoute={remoteRoute} />
            </Route>,
            <Route path="/bookmark/:bookmarkId/:position/loading/:type/:id/:mode?" exact={true} strict={true}>
                <div className="page-bg" />
                <RoutePlayerLoader targetRoute={targetRoute} remoteRoute={remoteRoute} />
            </Route>
        </Switch>
    );
}
