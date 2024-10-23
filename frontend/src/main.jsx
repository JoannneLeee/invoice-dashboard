import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AddInvoice from "./pages/addInvoice.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/addinvoice",
    element: <AddInvoice />,
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster/>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
