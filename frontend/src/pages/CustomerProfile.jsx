import { redirect, useParams } from "react-router";
import ErrorAlert from "../components/UI/ErrorAlert";
import CustomerForm from "../components/CustomerForm";
import VisitationsGrid from "../components/VisitationsGrid";
import { useState, useEffect } from "react";

export default function CustomerProfilePage() {
  const params = useParams();
  const isNewProfile = !params.customerId;

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    registrationDate: "",
  });
  const [customerLoading, setCustomerLoading] = useState(!isNewProfile);
  const [customerError, setCustomerError] = useState(null);

  const [customerVisits, setCustomerVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(!isNewProfile);
  const [visitsError, setVisitsError] = useState(null);

  useEffect(() => {
    const customerController = new AbortController();
    const visitsController = new AbortController();

    const fetchCustomer = async (customer) => {
      setCustomerLoading(true);
      setCustomerError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/customer/${customer}`,
          {
            signal: customerController.signal,
          }
        );
        if (!response.ok) throw new Error("Customer not found");
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setCustomerError(err.message || "Failed to load customer");
        }
      } finally {
        setCustomerLoading(false);
      }
    };

    const fetchCustomerVisits = async (customerId) => {
      setCustomerLoading(true);
      setCustomerError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/visit/${customerId}`,
          {
            signal: visitsController.signal,
          }
        );
        if (!response.ok) throw new Error("Customer visits not found");
        const data = await response.json();
        setCustomerVisits(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setVisitsError(err.message || "Failed to load visits");
        }
      } finally {
        setVisitsLoading(false);
      }
    };

    if (!isNewProfile) {
      fetchCustomer(params.customerId);
      fetchCustomerVisits(params.customerId);
    }

    return () => {
      customerController.abort();
      visitsController.abort();
    };
  }, []);

  return (
    <>
      <h1>{isNewProfile ? `Create new customer` : `Customer Profile`}</h1>

      {customerLoading && <p>Loading customer data...</p>}
      {customerError && (
        <ErrorAlert onDismiss={() => setCustomerError(null)}>
          {customerError}
        </ErrorAlert>
      )}
      {!customerLoading && <CustomerForm customer={customer} method={isNewProfile ? "post" : "patch"} />}

      {visitsLoading && <p>Loading customer visits...</p>}
      {visitsError && (
        <ErrorAlert onDismiss={() => setVisitsError(null)}>
          {visitsError}
        </ErrorAlert>
      )}
      {customerVisits.length > 0 && (
        <>
          <h2 className="mt-4">Visitations</h2>
          <VisitationsGrid visits={customerVisits} showCustomerData={false} />
        </>
      )}
    </>
  );
}

export async function action({ request, params }) {
  const data = await request.formData();
  const profileData = {
    name: data.get("name"),
    email: data.get("email"),
    registrationDate: data.get("registrationDate"),
  };

  const response = await fetch("http://localhost:5000/api/customer", {
    method: "POST",
    body: JSON.stringify(profileData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not save customer profile.");
  }

  return redirect(`/customers/profile/${response.id}`);
}
