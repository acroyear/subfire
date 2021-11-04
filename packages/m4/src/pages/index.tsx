import Page1 from './Page1';
import Page2 from './Page2';
import p404 from './404';

const pages = {
    "Page1": Page1,
    "Page2/[id]": Page2,
    "[any]": p404
};

export default pages;
