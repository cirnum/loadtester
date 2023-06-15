/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { getCommonLoadingState } from "../../../store/stress/aws/selectors";
import { createEC2Action } from "../../../store/stress/aws/actions";
import { EC2CreatePayload } from "../../../store/stress/aws/types";

const amiList = ["ami-07fe61018a1927002"];
const instanceTypes = [
  "t2.nano",
  "t2.micro",
  "t2.small",
  "t2.medium",
  "t2.large",
];
export default function Form() {
  const loading = useSelector(getCommonLoadingState);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<any>();

  function onSubmit(values) {
    if (values.count > 0) {
      values.count = parseInt(values.count, 10);
    }
    dispatch(createEC2Action(values as EC2CreatePayload));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel htmlFor="ami">Select AMI</FormLabel>
        <Select
          id="ami"
          placeholder="Select AMI"
          {...register("ami", {
            required: "Image Id Field required.",
          })}
        >
          {amiList.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="keyname">Select Pem KeyName</FormLabel>
        <Input
          id="keyName"
          placeholder="Pem Key Name"
          {...register("keyName", {
            required: "KeyName is required",
          })}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="instanceType">Instance Type</FormLabel>
        <Select
          id="instanceType"
          placeholder="Select Instance Type"
          {...register("instanceType", {
            required: "Instance Type Field required.",
          })}
        >
          {instanceTypes.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          {errors.name && errors.name.message?.toString()}
        </FormErrorMessage>
        <FormLabel htmlFor="count">Number of Instance</FormLabel>
        <Input
          id="count"
          type="number"
          placeholder="Number of Instance"
          {...register("count")}
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
        Create EC2
      </Button>
    </form>
  );
}
