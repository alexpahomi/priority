import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

import Welcome from "./pages/Welcome";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/Error";
import CustomersPage, { loader as customersLoader } from "./pages/Customers";
import CustomerProfilePage, {
  loader as customerProfileLoader,
} from "./pages/CustomerProfile";
import AnalyticsPage from "./pages/Analytics";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Welcome /> },
      {
        path: "customers",
        element: <CustomersPage />,
        loader: customersLoader,
      },
      { path: "customers/profile/", element: <CustomerProfilePage /> },
      {
        path: "customers/profile/:customerId",
        element: <CustomerProfilePage />,
        loader: customerProfileLoader,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}
