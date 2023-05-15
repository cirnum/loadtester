import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HStack, Text } from "@chakra-ui/react";
import {
  getRequestHistory,
  getSelectedRequestId,
} from "../../../store/stress/dashboard/selectors";
import Spinner from "../../../components/Spinner";
import ErrorComp from "../../../components/Error";
import { RequestHistoryPayload } from "../../../store/stress/dashboard/types";
import {
  fetchHistoryAction,
  selectRequestAction,
} from "../../../store/stress/dashboard/actions";

function ItemList({ item }: { item: RequestHistoryPayload }) {
  const dispatch = useDispatch();
  const selectedRequestId = useSelector(getSelectedRequestId);
  const clickOnRequest = (request: RequestHistoryPayload) => {
    dispatch(selectRequestAction(request));
  };
  return (
    <HStack
      spacing={2}
      p={2}
      role="button"
      _hover={{
        background: "#e2e8f1",
        color: "black",
        pointerEvents: "",
      }}
      background={selectedRequestId === item.id ? "#e2e8f1" : ""}
      color={selectedRequestId === item.id ? "black" : ""}
      onClick={() => clickOnRequest(item)}
      borderBottom={selectedRequestId === item.id ? "2px solid tomato" : ""}
    >
      <Text fontSize="sm" color="tomato" as="b">
        {item.method}
      </Text>
      <Text fontSize="sm" isTruncated fontWeight="medium">
        {item.url}
      </Text>
    </HStack>
  );
}

const pagination = { page: 1, limit: 20 };
export default function History() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchHistoryAction(pagination));
  }, []);

  const { error, loading, requests } = useSelector(getRequestHistory);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorComp />;
  }
  return (
    <div>
      {requests?.data?.data?.map((item) => {
        return <ItemList key={item.id} item={item} />;
      })}
    </div>
  );
}