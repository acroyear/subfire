import { Subsonic, SubsonicLoader } from "@subfire/core";
import { SubsonicTypes } from "@subfire/core";
import { Redirect, Route, Switch, useHistory, useParams } from "react-router-dom";
import { useSubsonicLoader } from "../../hooks/useSubsonicLoader";
import { SubfireRouterParams } from "./RouterTypes";

export interface RouteLoaderProps {
    targetRoute?: string;
    remoteRoute?: string;
}

export const RoutePlayerLoader = ({ targetRoute = "/player", remoteRoute = "/remoteControl" }: RouteLoaderProps) => {
    const params = useParams<SubfireRouterParams>();
    const {id, type, mode} = params;
    const o = Subsonic.constructFakeObject(type, id);
    const {
        state, card, result, error
      } = useSubsonicLoader(() => SubsonicLoader(params), o);

      console.log(card, result, error, state);
      if (card) return (<>{card}</>);
      if (error) return <p>{JSON.stringify(error)}</p>;
      return <Redirect to={targetRoute} push/>;
}

export const RouteLoader = ({ targetRoute = "/player", remoteRoute = "/remoteControl" }: RouteLoaderProps) => {
    return (
        <>
            <Route path="/load(ing)/:type/:id/:mode?" exact={true} strict={true}>
                <div className="page-bg" />
                <RoutePlayerLoader targetRoute={targetRoute} remoteRoute={remoteRoute} />
            </Route>
            <Route path="/bookmark/:bookmarkId/:position/loading/:type/:id/:mode?" exact={true} strict={true}>
                <div className="page-bg" />
                <RoutePlayerLoader targetRoute={targetRoute} remoteRoute={remoteRoute} />
            </Route>
        </>
    );
}
