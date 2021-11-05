import { SubfireRouterParams, useSubsonicLoader, useSubsonicQueue } from "@subfire/components";
import { Subsonic, SubsonicLoader } from "@subfire/core";
import { Redirect, useParams } from "react-router";

export const QueueLoader = (_props: any) => {
    const params = useParams<SubfireRouterParams>();
    const { type, id } = params;
    const o = Subsonic.constructFakeObject(type, id);
    const q = useSubsonicQueue();
    const {
        state, card, result, error
    } = useSubsonicLoader(() => SubsonicLoader(params), o);
    console.log(card, result, error, state);
    if (card) return (<>{card}</>);
    if (error) return <p>{JSON.stringify(error)}</p>;

    q.set(result, 0); // todo: rule and bookmark position
    return <Redirect to="/player" />
}