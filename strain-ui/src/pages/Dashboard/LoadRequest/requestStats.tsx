import { Box, Divider } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner";
import { Stats } from "../../../components/Stats";
import { useInterval } from "../../../hooks/useInterval";
import { getLoadsterAction } from "../../../store/stress/dashboard/actions";
import {
  getLoadsterData,
  getSelectedRequest,
  getSelectedRequestId,
} from "../../../store/stress/dashboard/selectors";

export function RequestStats({
  selectedRequestId,
}: {
  selectedRequestId: string;
}) {
  const dispatch = useDispatch();
  const { data } = useSelector(getLoadsterData);
  const selectedRequest = useSelector(getSelectedRequest);

  const isFinish = data?.data?.filter((item) => item.finish);
  useInterval(
    () => {
      dispatch(getLoadsterAction({ reqId: selectedRequestId }));
    },
    isFinish?.length ? null : 3000
  );

  return (
    <Box w="full" borderRight="2px solid #e2e8f0">
      <Divider />
      {selectedRequestId && selectedRequest && (
        <Box w="full" p={10} borderRight="2px solid #e2e8f0">
          <Stats selectedRequest={selectedRequest} />
        </Box>
      )}
    </Box>
  );
}

export function RequestLoadsterData() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(getLoadsterData);
  const selectedRequestId = useSelector(getSelectedRequestId);
  useEffect(() => {
    if (selectedRequestId) {
      dispatch(getLoadsterAction({ reqId: selectedRequestId }));
    }
  }, [selectedRequestId]);
  if (!data?.data && loading) {
    return <Spinner />;
  }
  if (selectedRequestId && data?.data) {
    return <RequestStats selectedRequestId={selectedRequestId} />;
  }
  return null;
}
