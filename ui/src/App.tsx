import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter } from "react-router-dom";
import Route from "./routes/routes";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Route />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
