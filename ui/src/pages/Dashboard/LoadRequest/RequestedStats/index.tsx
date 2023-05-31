import { Box, Button, Spacer, VStack } from "@chakra-ui/react";
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
import { NumberFormat } from "../../../../utils/_shared";

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
    <VStack padding="12px 54px" width="100%">
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        width="100%"
      >
        <StatusInfo
          text={loadsterRespons?.finish ? "Completed" : "Running..."}
          positive={!loadsterRespons?.finish}
        />
        <Spacer />
        <Button onClick={() => navigate(`/request/${selectedRequestId}`)}>
          View In Details
        </Button>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        <Stats
          state={STATE.NORMAL}
          value={(loadsterRespons?.minLatency || 0) / 1000}
          text="Fastest (MS)"
        />
        <Stats
          state={STATE.NORMAL}
          value={(loadsterRespons?.maxLatency || 0) / 1000}
          text="Slowest (MS)"
        />
        <Stats
          state={STATE.NORMAL}
          value={loadsterRespons?.timeTaken || 0}
          text="Time"
        />
        <Stats
          state={STATE.NORMAL}
          value={NumberFormat(loadsterRespons?.totalRequest || 0)}
          text="Total Hit"
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
      </Box>
    </VStack>
  );
}
