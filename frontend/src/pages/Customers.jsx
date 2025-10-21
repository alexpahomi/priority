import { Await, Link, useLoaderData } from "react-router";
import { Suspense } from "react";
import CustomersGrid from "../components/CustomersGrid";

function CustomersPage() {
  const { customers } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <Await resolve={customers}>
        {(loadedCustomers) => <CustomersGrid customers={loadedCustomers} />}
      </Await>
    </Suspense>
  );
}

export default CustomersPage;

async function loadCustomers() {
  const response = await fetch("http://localhost:5000/api/customer");

  if (!response.ok) {
    throw {
      message: "Could not fetch customers.",
      status: 500,
    };
  } else {
    const resData = await response.json();

    return resData;
  }
}

export async function loader() {
  return {
    customers: loadCustomers(),
  };
}
