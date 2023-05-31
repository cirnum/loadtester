import { SignIn, SignUp } from "@clerk/clerk-react";
import { lazy } from "react";

const RequestPage = lazy(() =>
  import("../pages/Request").then((m) => ({
    default: m.default,
  }))
);

const HomePage = lazy(() =>
  import("../pages/Home").then((m) => ({
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

export const ALL_ROUTES = [
  { path: "/", comp: HomePage, isProtected: false },
  { path: "/*", comp: NotFound, isProtected: false },
  { path: "signup/*", childPath: "/signup", comp: SignUp, isProtected: false },
  { path: "signin/*", childPath: "/signin", comp: SignIn, isProtected: false },
  { path: "dashboard", comp: Dashboard, isProtected: true },
  { path: "stress", comp: RequestPage, isProtected: true },
  { path: "request/:requestId", comp: RequestPage, isProtected: true },
  { path: "server", comp: ServerPage, isProtected: true },
];
