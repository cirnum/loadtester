import { Navigate, useOutlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { getSettingsAction } from "../store/stress/common/actions";
import { getSettigs } from "../store/stress/common/selectors";

export function ProtectedLayout() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const settings = useSelector(getSettigs);
  const outlet = useOutlet();

  useEffect(() => {
    if (!settings?.data) {
      dispatch(getSettingsAction());
    }
  }, []);
  if (!user || user == null) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <SideBar>{outlet}</SideBar>
    </div>
  );
}
