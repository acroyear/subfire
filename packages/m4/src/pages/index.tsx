import { ComponentType } from 'react';

import Page1 from './Page1';
import Page2 from './Page2';
import P404 from './404';

// the real ones
import { Playlists } from './Playlists';
import { Player1 } from './Player1';

export interface PageRouteData {
    path: string;
    component: ComponentType;
    exact: boolean;
}

const Index = (_props: any) => {
    return <>index</>;
}

const Empty = (_props: any) => {
    return <></>;
}

const pages: Array<PageRouteData> = [
    { path: "/Page1", component: Page1, exact: true },
    { path: "/Page2/:id", component: Page2, exact: true },

    // the real ones - start with the most greedy first
    { path: "/playlists/:pltype?", component: Playlists, exact: true },
    { path: "/player", component: Player1, exact: true },

    // eventually make these (plus the remote stuff) constants
    { path: '/load(ing)/:type/:id/:mode?', component: Empty, exact: true },
    { path: '/bookmark/:bookmarkId/:position/loading/:type/:id/:mode?', component: Empty, exact: true },
    { path: '/login', component: Empty, exact: true },
    { path: '/linkSource', component: Empty, exact: true },
    { path: '/linkClient', component: Empty, exact: true },

    { path: "/:any", component: P404, exact: true }, // when loading something else

    { path: null, component: Index, exact: true }, // root page later
]

export default pages;
