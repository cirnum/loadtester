import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { router } from "./routes";

function App() {
  return (
    <div className="">
      <Toaster />
      <RouterProvider router={router} />
      <Analytics />
    </div>
  );
}

export default App;
