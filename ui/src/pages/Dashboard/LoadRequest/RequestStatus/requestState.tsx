import { Stat, Button, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Stats } from "../../../../components/Stats";
import { StatFields } from "../../../../constants/request.const";
import {
  getLoadsterData,
  getLoadsterList,
  getSelectedRequest,
  getSelectedRequestId,
} from "../../../../store/stress/dashboard/selectors";
import { useInterval } from "../../../../hooks/useInterval";
import { getLoadsterAction } from "../../../../store/stress/dashboard/actions";
import Spinner from "../../../../components/Spinner";

export function RequestState() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading } = useSelector(getLoadsterData);
  const selectedRequestId = useSelector(getSelectedRequestId);
  const loadsterRespons = useSelector(getLoadsterList);
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
    <Box w="full" p={10} borderRight="2px solid #e2e8f0">
      <Text fontWeight="bold" pb={5}>
        Request Status
      </Text>

      <Stats fieldsToPopulate={StatFields} data={loadsterRespons}>
        <Stat display="flex" alignItems="center">
          <Button onClick={() => navigate(`/request/${selectedRequest?.id}`)}>
            View In Details
          </Button>
        </Stat>
      </Stats>
    </Box>
  );
}
