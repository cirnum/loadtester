// eslint-disable-next-line import/no-extraneous-dependencies
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  addServerAction,
  editServerAction,
} from "../../../store/stress/server/actions";
import { getAddServerState } from "../../../store/stress/server/selectors";
import {
  AddServerRequestPayload,
  Server,
} from "../../../store/stress/server/types";

export default function AddOrEdit({ server }: { server?: Server }) {
  const { loading, addOrEdit } = useSelector(getAddServerState);
  const actionState = addOrEdit?.actionState || undefined;
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (server) {
      // eslint-disable-next-line guard-for-in
      for (const field in server) {
        setValue(field, server[field]);
      }
    }
  }, []);
  function onSubmit(values) {
    let payload: AddServerRequestPayload = values;
    if (values.port) {
      payload = { ...payload, port: parseInt(values.port, 10) };
    } else {
      payload.port = 0;
    }
    if (actionState === "EDIT") {
      dispatch(editServerAction(payload as AddServerRequestPayload));
    } else {
      dispatch(addServerAction(payload));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="alias">Add server name</FormLabel>
        <Input
          id="alias"
          placeholder="Name"
          {...register("alias", {
            required: "Alias Field required.",
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="description">Add server description</FormLabel>
        <Input
          id="description"
          placeholder="Description"
          {...register("description", {
            required: "Description is required",
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="description">Add remote server address</FormLabel>
        <Input
          id="ip"
          placeholder="Add remote server address"
          {...register("ip")}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
      </FormControl>
      <Button
        bg="tomato"
        color="white"
        mt={8}
        _hover={{
          bg: "#ef6347",
        }}
        isLoading={loading}
        type="submit"
      >
        {actionState === "EDIT" ? "Update" : "Add"}
      </Button>
    </form>
  );
}
