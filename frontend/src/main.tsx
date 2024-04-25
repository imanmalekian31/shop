import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./providers";
import { BrowserRouter } from "react-router-dom";
import "./assets/css/index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors />
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
