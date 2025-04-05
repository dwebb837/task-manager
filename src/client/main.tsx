import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";

import App from "@/client/App";
import "@/client/index.css";
import QueryProvider from "./providers/QueryProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme>
      <QueryProvider>
        <App />
      </QueryProvider>
    </Theme>
  </React.StrictMode>
);
