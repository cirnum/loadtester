import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function HomeLayout() {
  const { user } = useAuth();
  const outlet = useOutlet();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <div>{outlet}</div>;
}
