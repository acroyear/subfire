import React from 'react';

import T from "@mui/material/Typography";
import G from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const Gc = p => <G container {...p} />;
export const Gci = p => <G container item {...p} />;
export const Gi = p => <G item {...p} />;

export { T };
export { G };
export const B = p => <Box display="flex" {...p}/>;

function tv(variant) {
  return function TV(p) {
    return <T variant={variant} {...p} />;
  };
}
export const Th1 = tv("h1");
export const Th2 = tv("h2");
export const Th3 = tv("h3");
export const Th4 = tv("h4");
export const Th5 = tv("h5");
export const Th6 = tv("h6");

export const Tst1 = tv("subtitle1");
export const Tst2 = tv("subtitle2");

export const Tb1 = tv("body1");
export const Tb2 = tv("body2");

export const Tbt = tv("button");
export const Tc = tv("caption");
export const To = tv("overline");
