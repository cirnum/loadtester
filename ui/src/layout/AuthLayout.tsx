import { Suspense } from "react";
import { useLoaderData, useOutlet, Await } from "react-router-dom";
import { Alert } from "@chakra-ui/react";
import { AuthProvider } from "../hooks/useAuth";

interface Loader {
  userPromise: Promise<any>;
}

export function AuthLayout() {
  const outlet = useOutlet();

  const { userPromise } = useLoaderData() as Loader;

  return (
    <Suspense fallback="">
      <Await
        resolve={userPromise}
        errorElement={<Alert status="error">Something went wrong!</Alert>}
        // eslint-disable-next-line react/no-children-prop
        children={(user: string) => (
          <AuthProvider userData={user}>{outlet}</AuthProvider>
        )}
      />
    </Suspense>
  );
}
