import { Navigate, useOutlet } from "react-router-dom";
import SideBar from "../components/Sidebar"
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout = () => {
  const { user } = useAuth();

  const outlet = useOutlet();

  if (!user || user == null) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <SideBar>
      {outlet}
      </SideBar>
    </div>
  );
};
