import { lazy, Suspense } from "react";
import {
  Route,
  createHashRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";
import { ProtectedLayout } from "../layout/ProtectedRoute";
import { AuthLayout } from "../layout/AuthLayout";
import { HomeLayout } from "../layout/HomeLayout";
import Spinner from "../components/Spinner";

// ideally this would be an API call to server to get logged in user data
const getUserData = () =>
  new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      const user = window.localStorage.getItem("user");
      resolve(user);
    }, 500)
  );

const RequestPage = lazy(() =>
  import("../pages/Request").then((m) => ({
    default: m.default,
  }))
);
const LoginPage = lazy(() =>
  import("../pages/Login").then((m) => ({
    default: m.default,
  }))
);

const HomePage = lazy(() =>
  import("../pages/Home").then((m) => ({
    default: m.default,
  }))
);

const SignUpPage = lazy(() =>
  import("../pages/Signup").then((m) => ({
    default: m.default,
  }))
);

const NotFound = lazy(() =>
  import("../pages/NotFound").then((m) => ({
    default: m.default,
  }))
);

const Dashboard = lazy(() =>
  import("../pages/Dashboard").then((m) => ({
    default: m.default,
  }))
);
const ServerPage = lazy(() =>
  import("../pages/Server").then((m) => ({
    default: m.default,
  }))
);
const AWSPage = lazy(() =>
  import("../pages/AWS").then((m) => ({
    default: m.default,
  }))
);

const SettingPage = lazy(() =>
  import("../pages/Settings").then((m) => ({
    default: m.default,
  }))
);

export const router = createHashRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<Spinner />}>
              <SignUpPage />
            </Suspense>
          }
        />
        <Route
          path="/signin"
          element={
            <Suspense fallback={<Spinner />}>
              <LoginPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="/" element={<ProtectedLayout />}>
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<Spinner />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route path="stress" element={<RequestPage />} />
        <Route
          path="request/:requestId"
          element={
            <Suspense fallback={<Spinner />}>
              <RequestPage />
            </Suspense>
          }
        />
        <Route
          path="workers"
          element={
            <Suspense fallback={<Spinner />}>
              <ServerPage />
            </Suspense>
          }
        />
        <Route
          path="aws"
          element={
            <Suspense fallback={<Spinner />}>
              <AWSPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<Spinner />}>
              <SettingPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Route>
  )
);
