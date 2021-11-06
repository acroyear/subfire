import { ComponentType } from 'react';

import Page1 from './Page1';
import Page2 from './Page2';
import p404 from './404';

// the real ones
import { Playlists } from './Playlists';
import { QueueLoader } from './QueueLoader';
import { Player1 } from './Player1';

export interface PageRouteData {
    path: string;
    component: ComponentType;
    exact: boolean;
}

const pages: Array<PageRouteData> = [
    { path: "/Page1", component: Page1, exact: true },
    { path: "/Page2/:id", component: Page2, exact: true },

    // the real ones - start with the most greedy first
    { path: "/load(ing)/:type/:id/:mode?", component: QueueLoader, exact: true },
    { path: "/bookmark/:bookmarkId/:position/loading/:type/:id/:mode?", component: QueueLoader, exact: true },
    { path: "/playlists/:pltype?", component: Playlists, exact: true },
    { path: "/player", component: Player1, exact: true },
    { path: "/:any", component: p404, exact: true }, // 404 page
    { path: null, component: p404, exact: true }, // root page later
]

export default pages;
