import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import {
    Alert,
  } from '@chakra-ui/react'

  interface Loader {
    userPromise: Promise<any>
  }
export const AuthLayout = () => {
  const outlet = useOutlet();

  const { userPromise } = useLoaderData() as Loader;

  return (
    <Suspense fallback={""}>
      <Await
        resolve={userPromise}
        errorElement={<Alert status="error">Something went wrong!</Alert>}
        children={(user: string) => (
          <AuthProvider userData={user}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  );
};
