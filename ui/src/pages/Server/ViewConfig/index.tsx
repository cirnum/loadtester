import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "../../../components/Dialog";
import { addOrEditServer } from "../../../store/stress/server/actions";
import { getAddOrEditState } from "../../../store/stress/server/selectors";
import AddOrEdit from "./form";

export default function ServerConfigComp() {
  const { actionState = undefined, server } = useSelector(getAddOrEditState);
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(
      addOrEditServer({
        actionState: undefined,
        server: undefined,
      })
    );
  };
  return (
    <Dialog
      isOpen={actionState === "VIEW_CONFIG"}
      onClose={onClose}
      title="View Server Config"
    >
      <AddOrEdit server={server} />
    </Dialog>
  );
}
