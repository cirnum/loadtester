/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCommonLoadingState,
  getPemFileState,
} from "../../../store/stress/aws/selectors";
import {
  createEC2Action,
  getPemFilesAction,
} from "../../../store/stress/aws/actions";
import { EC2CreatePayload } from "../../../store/stress/aws/types";
import CreatePem from "../Pem/createPem";
import { AmiList, InstanceTypes } from "../../../constants/_shared.const";

export default function Form() {
  const loading = useSelector(getCommonLoadingState);
  const { loading: pemLoading, data: pemFileList } =
    useSelector(getPemFileState);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<any>();

  function fetchPemFilesName() {
    dispatch(getPemFilesAction());
  }
  function onSubmit(values) {
    if (values.count > 0) {
      values.count = parseInt(values.count, 10);
    }
    dispatch(createEC2Action(values as EC2CreatePayload));
  }

  useEffect(() => {
    fetchPemFilesName();
  }, []);
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
          {AmiList.map((item) => {
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
        <HStack>
          <Select
            id="keyName"
            placeholder={pemLoading ? "Fetching key names" : "Select Key Name"}
            {...register("keyName", {
              required: "KeyName is required",
            })}
          >
            {pemFileList?.data?.map((item) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </Select>
          <CreatePem />
        </HStack>
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
          {InstanceTypes.map((item) => {
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
