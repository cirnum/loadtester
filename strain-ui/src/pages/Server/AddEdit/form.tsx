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
import { addServerAction } from "../../../store/stress/server/actions";
import { getAddServerState } from "../../../store/stress/server/selectors";
import { Server } from "../../../store/stress/server/types";

const EditableField = ["alias", "description", "ip", "port"];
export default function AddOrEdit({ server }: { server?: Server }) {
  const { loading } = useSelector(getAddServerState);
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
        if (EditableField.includes(field)) {
          setValue(field, server[field]);
        }
      }
    }
  }, []);
  function onSubmit(values) {
    console.log("values", values);
    const payload = { alias: values.alias, description: values.description };
    dispatch(addServerAction(payload));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="alias">Add server Alias</FormLabel>
        <Input
          id="alias"
          placeholder="Alias"
          {...register("alias", {
            required: "Alias Field required.",
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="description">Add server Description</FormLabel>
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
        <FormLabel htmlFor="description">Add Your Remote IP</FormLabel>
        <Input id="IP" placeholder="Add remote server IP" {...register("ip")} />
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="description">Add Your Remote Port</FormLabel>
        <Input
          id="port"
          placeholder="Add remote server Port"
          {...register("port")}
        />
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
        Submit
      </Button>
    </form>
  );
}
