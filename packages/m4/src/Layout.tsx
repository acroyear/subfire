import { LoaderSwitch, ModalSwitch, PageSwitch } from '@subfire/components';
import { useSubsonic } from '@subfire/hooks';
import pages from './pages';
import headers from './headers';

export const Layout = (_props: any) => {
    const { isLoggedIn } = useSubsonic();
    return (
        <>
            <PageSwitch pages={headers}></PageSwitch>
            {!isLoggedIn && <>Loading...</>}
            {isLoggedIn && <>
                <PageSwitch pages={pages}></PageSwitch>
                <LoaderSwitch />
                <ModalSwitch />
            </>}
        </>
    );
}

