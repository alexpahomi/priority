import { RouterProvider } from "react-router/dom";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

import RootLayout from "./pages/RootLayout";

const WelcomePage = lazy(() => import("./pages/Welcome"));
const CustomersPage = lazy(() => import("./pages/Customers"));
const AnalyticsPage = lazy(() => import("./pages/Analytics"));
const CustomerProfilePage = lazy(() => import("./pages/CustomerProfile"));
import {action as manipulateCustomerProfileAction} from "./pages/CustomerProfile";

import ErrorPage from "./pages/Error";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Suspense fallback={<p>Loading...</p>}><WelcomePage /></Suspense> },
      {
        path: "customers",
        element: <Suspense fallback={<p>Loading...</p>}><CustomersPage /></Suspense>,
        loader: () => import("./pages/Customers").then((module) => module.loader()),
      },
      {
        path: "customers/profile/",
        element: <Suspense fallback={<p>Loading...</p>}><CustomerProfilePage /></Suspense>,
        action: manipulateCustomerProfileAction,
      },
      {
        path: "customers/profile/:customerId",
        element: <Suspense fallback={<p>Loading...</p>}><CustomerProfilePage /></Suspense>,
        action: manipulateCustomerProfileAction,
      },
      {
        path: "analytics",
        element: <Suspense fallback={<p>Loading...</p>}><AnalyticsPage /></Suspense>,
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
