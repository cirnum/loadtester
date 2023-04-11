import { lazy } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";
import { ProtectedLayout } from "../layout/ProtectedRoute";
import { AuthLayout } from "../layout/AuthLayout";
import { HomeLayout } from "../layout/HomeLayout";

// ideally this would be an API call to server to get logged in user data
const getUserData = () =>
  new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      const user = window.localStorage.getItem("user");
      resolve(user);
    }, 500)
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
const StressTest = lazy(() =>
  import("../pages/StressTest").then((m) => ({
    default: m.default,
  }))
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<LoginPage />} />
      </Route>

      <Route path="/" element={<ProtectedLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="stress" element={<StressTest />} />
      </Route>
      <Route path="/*" element={<NotFound />} />
    </Route>
  )
);
