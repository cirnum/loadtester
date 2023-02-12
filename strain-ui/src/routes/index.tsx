import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    defer
  } from "react-router-dom";
  import { ProtectedLayout } from "../layout/ProtectedRoute";
  import {AuthLayout}  from "../layout/AuthLayout";
  import {HomeLayout}  from "../layout/HomeLayout";
  import HomePage from "../pages/Home";
  import LoginPage from "../pages/Login";
  import SignUpPage from "../pages/Signup";
  import NotFound from "../pages/NotFound";

  import  Dashboard  from "../pages/Dashboard";
  import  StressTest  from "../pages/StressTest";

  
  // ideally this would be an API call to server to get logged in user data
  
  const getUserData = () =>
    new Promise((resolve) =>
      setTimeout(() => {
        const user = window.localStorage.getItem("user");
        resolve(user);
      }, 500)
    );
  
  // for error
  // const getUserData = () =>
  //   new Promise((resolve, reject) =>
  //     setTimeout(() => {
  //       reject("Error");
  //     }, 3000)
  //   );
  
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
  