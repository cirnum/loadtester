import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import CustomTheme from "./theme";
import store from "./store";

import "./index.css";

const theme = extendTheme(CustomTheme);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
