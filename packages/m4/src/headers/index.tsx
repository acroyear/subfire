import { ComponentType } from 'react';
import MainHeader from './MainHeader';

const PlayerHeader = () => <>Player Header</>;

const LoaderHeader = () => <> Loader Header</>;

interface PageRouteData {
    path: string;
    component: ComponentType;
    exact: boolean;
}

const pages: Array<PageRouteData> = [

    { path: "/player", component: PlayerHeader, exact: true },

    { path: '/load(ing)/:type/:id/:mode?', component: LoaderHeader, exact: true },
    { path: '/bookmark/:bookmarkId/:position/loading/:type/:id/:mode?', component: LoaderHeader, exact: true },

    { path: null, component: MainHeader, exact: true },
]

export default pages;
