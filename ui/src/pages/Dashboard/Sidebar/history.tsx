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
import MethodInfo from "../../../components/Info/MethodInfo";

function ItemList({ item }: { item: RequestHistoryPayload }) {
  const dispatch = useDispatch();
  const selectedRequestId = useSelector(getSelectedRequestId);
  const clickOnRequest = (request: RequestHistoryPayload) => {
    dispatch(selectRequestAction(request));
  };
  return (
    <HStack
      spacing={6}
      p={3}
      role="button"
      borderY={selectedRequestId === item.id ? "#EDF4FF" : "1px solid #EBEBEB"}
      _hover={{
        background: "#e2e8f1",
        color: "black",
        pointerEvents: "",
      }}
      boxSizing="border-box"
      height="60px"
      alignItems="center"
      padding="16px 24px"
      background={selectedRequestId === item.id ? "#EDF4FF" : ""}
      color={selectedRequestId === item.id ? "black" : ""}
      onClick={() => clickOnRequest(item)}
      borderBottom={selectedRequestId === item.id ? "1px" : ""}
      borderColor={selectedRequestId === item.id ? "#0066FF" : ""}
    >
      <MethodInfo>
        <Text fontSize="sm" color="tomato.400" as="b">
          {item.method}
        </Text>
      </MethodInfo>
      <Text
        sx={{
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "20px",
          color: "#171239",
        }}
        fontSize="sm"
        isTruncated
        fontWeight="medium"
      >
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
  if (!requests?.data?.data?.length) {
    return (
      <ErrorComp
        title="History not found"
        message="Not made any request so fat"
        type="info"
      />
    );
  }
  return (
    <div>
      {requests?.data?.data?.map((item) => {
        return <ItemList key={item.id} item={item} />;
      })}
    </div>
  );
}
