import {
  Stack,
  Input,
  FormControl,
  FormLabel,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addServerAction,
  clearServerState,
} from "../../store/stress/server/actions";
import { getAddServerState } from "../../store/stress/server/selectors";

export default function ServerForm({
  onClose,
}: {
  onClose: (val: boolean) => void;
}) {
  const [alias, setAlias] = useState("");
  const [dsc, setDesc] = useState("");
  const [isSend, setSend] = useState(false);
  const { loading, data } = useSelector(getAddServerState);
  const dispatch = useDispatch();

  const onSubmit = () => {
    const payload = { alias, description: dsc };
    if (!alias || !dsc) {
      setSend(true);
      return;
    }
    dispatch(addServerAction(payload));
  };

  useEffect(() => {
    if (data) {
      onClose(true);
      dispatch(clearServerState());
    }
  }, [data]);
  return (
    <Stack spacing={3}>
      <FormControl id="server-name">
        <FormLabel>Add Server Name</FormLabel>
        <Input
          value={alias}
          variant="filled"
          placeholder="Alias"
          onChange={(e) => setAlias(e.target.value)}
          errorBorderColor="crimson"
          isInvalid={isSend && !alias}
        />
      </FormControl>
      <FormControl id="server-desc">
        <FormLabel>Add server Description</FormLabel>
        <Input
          value={dsc}
          variant="filled"
          placeholder="Description"
          errorBorderColor="crimson"
          isInvalid={isSend && !dsc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </FormControl>
      <Button
        onClick={onSubmit}
        bg="tomato"
        color="white"
        _hover={{
          bg: "#ef6347",
        }}
      >
        {loading ? <Spinner /> : "Add"}
      </Button>
    </Stack>
  );
}
