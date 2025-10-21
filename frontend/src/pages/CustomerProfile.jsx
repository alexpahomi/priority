export default function CustomerProfilePage() {
    return <h1>Customer Profile Page</h1>;
}

async function loadCustomer(customerId) {
  const response = await fetch(`http://localhost:5000/api/customer/${customerId}`);

  if (!response.ok) {
    throw {
      message: "Could not fetch customer.",
      status: 500,
    };
  } else {
    const resData = await response.json();
    return resData.customer;
  }
}

export async function loader({ params }) {
  return {
    customer: loadCustomer(params.customerId),
  };
}