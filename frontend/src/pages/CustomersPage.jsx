import { Await, useLoaderData } from "react-router";
import CustomersList from "../components/CustomersList";
import { Suspense } from "react";

function CustomersPage() {
  const data = useLoaderData();
  
  const customers = data.customers;

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={customers}>
        {/* todo add filter */}
        {(loadedCustomers) => <CustomersList customers={loadedCustomers} />}
      </Await>
    </Suspense>
  );
}

export default CustomersPage;

async function loadCustomers() {
  const response = await fetch("http://localhost:5000/api/customers");

  if (!response.ok) {
    throw {
      message: "Could not fetch customers.",
      status: 500,
    };
  } else {
    const resData = await response.json();
    return resData.customers;
  }
}

export async function loader() {
  return {
    customers: loadCustomers(),
  };
}
