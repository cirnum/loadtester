import  { Toaster } from "react-hot-toast";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";


function App() {
  return (
    <div className="">
      <Toaster/>
      <RouterProvider router={router} />
    </div>

  );
}

export default App;
