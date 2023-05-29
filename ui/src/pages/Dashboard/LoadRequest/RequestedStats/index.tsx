import { Button, HStack } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Stats, { STATE } from "./stats";
import {
  getLoadsterData,
  getLoadsterList,
  getSelectedRequest,
  getSelectedRequestId,
} from "../../../../store/stress/dashboard/selectors";
import StatusInfo from "../../../../components/Info/statusInfo";
import { useInterval } from "../../../../hooks/useInterval";
import { getLoadsterAction } from "../../../../store/stress/dashboard/actions";
import Spinner from "../../../../components/Spinner";

export default function RequestStats() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadsterRespons = useSelector(getLoadsterList);
  const selectedRequestId = useSelector(getSelectedRequestId);
  const { data, loading } = useSelector(getLoadsterData);
  const selectedRequest = useSelector(getSelectedRequest);
  const isFinish = loadsterRespons?.finish;

  useInterval(
    () => {
      dispatch(getLoadsterAction({ reqId: selectedRequestId }));
    },
    isFinish ? null : 3000
  );
  if (!selectedRequest) return null;
  if (!data?.data && loading) {
    return <Spinner />;
  }
  return (
    <HStack
      width="auto"
      borderRadius="8px"
      bg="#F8F8F8"
      margin="12px 24px"
      paddingX="24px"
      paddingY="12px"
      flexWrap="wrap"
    >
      <StatusInfo
        text={loadsterRespons?.finish ? "Completed" : "Running"}
        positive={!loadsterRespons?.finish}
      />
      <Stats
        state={STATE.NORMAL}
        value={loadsterRespons?.timeTaken || 0}
        text="Time"
      />
      <Stats
        state={STATE.NORMAL}
        value={loadsterRespons?.totalRequest || 0}
        text="Total Request"
      />
      <Stats
        state={STATE.POSITIVE}
        value={loadsterRespons?.totalRPS || 0}
        text="Total RPS"
      />
      <Stats
        state={STATE.POSITIVE}
        value={loadsterRespons?.successRPS || 0}
        text="Success RPS"
      />
      <Stats
        state={STATE.NAGATIVE}
        value={loadsterRespons?.failRPS || 0}
        text="Failed RPS"
      />
      <Button onClick={() => navigate(`/request/${selectedRequestId}`)}>
        View In Details
      </Button>
    </HStack>
  );
}
