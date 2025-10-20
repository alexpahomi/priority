import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import "./App.css";

import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./pages/RootLayout";
import Welcome from "./pages/Welcome";
import CustomersPage, { customersLoader } from "./pages/CustomersPage";
import CustomerDetailPage, {
  loader as customerDetailLoader,
} from "./pages/CustomerDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    children: [
      { index: true, element: <Welcome /> },
      {
        path: "customers",
        children: [
          {
            index: true,
            element: <CustomersPage />,
            loader: customersLoader,
          },
          {
            path: ":customerId",
            id: "customer-detail",
            loader: customerDetailLoader,
            children: [
              {
                index: true,
                element: <CustomerDetailPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
