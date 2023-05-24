import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "../../../components/Modal";
import { addOrEditServer } from "../../../store/stress/server/actions";
import { getAddOrEditState } from "../../../store/stress/server/selectors";
import AddOrEdit from "./form";

export default function AddOrEditComp() {
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
    <Dialog isOpen={!!actionState} onClose={onClose}>
      <AddOrEdit server={server} />
    </Dialog>
  );
}
