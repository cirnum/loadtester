import { Button, Spinner } from "@chakra-ui/react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCreatePemState } from "../../../store/stress/aws/selectors";
import { createPemKeyRequestAction } from "../../../store/stress/aws/actions";

export default function CreatePem() {
  const dispatch = useDispatch();
  const { loading } = useSelector(getCreatePemState);
  return (
    <Button
      variant="outline"
      colorScheme="primary"
      onClick={() => {
        dispatch(createPemKeyRequestAction());
      }}
    >
      {loading ? <Spinner /> : "Create Key"}
    </Button>
  );
}
