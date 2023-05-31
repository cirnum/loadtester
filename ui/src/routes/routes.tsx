import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/clerk-react";
import { Suspense, useEffect } from "react";
import { ALL_ROUTES } from "./map";
import SidebarWithHeader from "../components/Sidebar/oauthSidebar";
import Login from "../pages/Login/login";
import { saveToken } from "../store/auth/actions";
import Spinner from "../components/Spinner";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AllRoutes() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const saveToStore = async () => {
    const token = await getToken();
    dispatch(saveToken(token || ""));
  };

  useEffect(() => {
    saveToStore();
  }, []);
  return (
    <Routes>
      {ALL_ROUTES.map((routeDetails) => {
        const { path, childPath, isProtected, comp: Component } = routeDetails;
        if (childPath) {
          return (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<Spinner />}>
                  <Login>
                    <Component routing="path" path={childPath} />
                  </Login>
                </Suspense>
              }
            />
          );
        }
        if (isProtected) {
          return (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<Spinner />}>
                  <SignedIn>
                    <SidebarWithHeader>
                      <Component />
                    </SidebarWithHeader>
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" />
                  </SignedOut>
                </Suspense>
              }
            />
          );
        }
        return (
          <Route
            key={path}
            path={path}
            element={
              <Suspense fallback={<Spinner />}>
                <Component />
                <SignedIn>
                  <Navigate to="/dashboard" />
                </SignedIn>
              </Suspense>
            }
          />
        );
      })}
    </Routes>
  );
}
export default function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <AllRoutes />
    </ClerkProvider>
  );
}
