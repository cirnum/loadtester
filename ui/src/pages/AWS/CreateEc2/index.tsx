import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "../../../components/Dialog";
import CreateEc2Form from "./form";
import { toggleEC2Form } from "../../../store/stress/aws/actions";
import { getCreateEC2ToggleState } from "../../../store/stress/aws/selectors";

export default function CreateEC2() {
  const open = useSelector(getCreateEC2ToggleState);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(toggleEC2Form(false));
    // setOpen(false);
  };
  return (
    <Dialog isOpen={open} onClose={onClose} title="Create EC2 Server">
      <CreateEc2Form />
    </Dialog>
  );
}
