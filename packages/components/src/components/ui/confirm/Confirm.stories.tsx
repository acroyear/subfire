import React, { useState } from "react";

import ConfirmDialog from "./ConfirmDialog";
import useConfirmDialog from "./useConfirmDialog";
import { action } from "@storybook/addon-actions";

export default { title: "ui/confirm" };

export const ConfirmDialogDemo = (p: any) => {
  const { confirmUserAction } = useConfirmDialog();
  const confirmThis = () => {
    confirmUserAction(
      "Confirm This",
      "This is the content to confirm",
      () => {
        action("Confirmed");
        console.log("Confirmed");
      },
      () => {
        action("Rejected");
        console.log("Rejected");
      },
      "Confirm",
      "Reject",
      10
    );
  };
  return (
    <>
      <button onClick={confirmThis}>Open</button>
      <ConfirmDialog />
    </>
  );
};
