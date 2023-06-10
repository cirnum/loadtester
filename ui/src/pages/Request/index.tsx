import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getLoadsterAction } from "../../store/stress/dashboard/actions";
import { getLoadsterList } from "../../store/stress/dashboard/selectors";
import { useInterval } from "../../hooks/useInterval";
import { getRequestByIdAction } from "../../store/stress/request/actions";
import { getSelectedRequest } from "../../store/stress/request/selectors";
import Spinner from "../../components/Spinner";
import ServerSection from "./ServerSection";

function Request({ requestId }: { requestId: string }) {
  const dispatch = useDispatch();
  const data = useSelector(getLoadsterList);

  const isFinish = data?.finish;
  useInterval(
    () => {
      if (requestId) {
        dispatch(getLoadsterAction({ reqId: requestId }));
      }
    },
    isFinish ? null : 3000
  );

  useEffect(() => {
    if (requestId) {
      dispatch(getLoadsterAction({ reqId: requestId }));
    }
  }, [requestId]);

  if (!data?.serverMap) return null;

  return <ServerSection />;
}

export default function RequestWraper() {
  const dispatch = useDispatch();
  const { requestId } = useParams();
  const { data, loading } = useSelector(getSelectedRequest);

  useEffect(() => {
    if (requestId) {
      dispatch(getRequestByIdAction({ reqId: requestId }));
    }
  }, [requestId]);

  if (!data && loading) {
    return <Spinner />;
  }
  if (data && requestId) {
    return <Request requestId={requestId} />;
  }
  return null;
}
