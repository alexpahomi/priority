import { redirect, useActionData, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useFetch } from "../hooks/useFetch";
import Alert from "../components/UI/Alert";
import CustomerForm from "../components/CustomerForm";
import VisitationsGrid from "../components/VisitationsGrid";
import Modal from "../components/UI/Modal";
import VisitForm from "../components/VisitForm";

const getRequestConfig = {}; // defined ext because it's used as dependency in useFetch

export default function CustomerProfilePage() {
  const params = useParams();
  const actionData = useActionData();
  const isNewProfile = !params.customerId;
  const visitModal = useRef();

  // fetch customer data if editing existing profile using custom hook
  const customerUrl = isNewProfile
    ? null
    : `http://localhost:5000/api/customer/${params.customerId}`;
  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
    clearError: clearCustomerError,
  } = useFetch(customerUrl, getRequestConfig, {
    name: "",
    email: "",
    registrationDate: "",
  });

  // fetch customer visits if editing existing profile
  const visitUrl = isNewProfile
    ? null
    : `http://localhost:5000/api/visit/${params.customerId}`;
  const {
    data: customerVisits,
    isLoading: visitsLoading,
    error: visitsError,
    clearError: clearVisitsError,
  } = useFetch(visitUrl, getRequestConfig, [], [actionData?.resData?.id]);

  useEffect(() => {
    if (actionData?.visitAdded) {
      visitModal.current.close();
    }
  }, [actionData]);

  function handleAddVisit() {
    visitModal.current.open();
  }

  return (
    <>
      <div className="row mb-3 align-items-center">
        <div className="col">
          <h1>
            {isNewProfile ? "Create new customer" : "Edit Customer Profile"}
          </h1>
        </div>
        {!isNewProfile && (
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-sm btn-dark"
              onClick={handleAddVisit}
            >
              Register Visit
            </button>
          </div>
        )}
      </div>

      {customerLoading && <p>Loading customer data...</p>}
      {customerError && (
        <Alert type="danger" onDismiss={clearCustomerError}>
          {customerError}
        </Alert>
      )}
      {!customerLoading && (
        <CustomerForm
          customer={customer}
          method={isNewProfile ? "post" : "patch"}
        />
      )}

      {visitsLoading && <p>Loading customer visits...</p>}
      {visitsError && (
        <Alert type="info" onDismiss={clearVisitsError}>
          {visitsError}
        </Alert>
      )}
      {customerVisits.length > 0 && (
        <>
          <h2 className="mt-4">Visitations</h2>
          <VisitationsGrid visits={customerVisits} showCustomerData={false} />
        </>
      )}

      <Modal ref={visitModal}>
        <VisitForm
          customerId={params.customerId}
          onClose={() => visitModal.current.close()}
        />
      </Modal>
    </>
  );
}

export async function action({ request, params }) {
  const method = request.method;
  const data = await request.formData();

  if (data.has("hotelId")) {
    // add visit action
    const visitData = {
      customerId: parseInt(params.customerId),
      hotelId: parseInt(data.get("hotelId")),
      visitDate: data.get("visitDate"),
    };

    const response = await fetch("http://localhost:5000/api/visit", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visitData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Could not register visit." };
    }

    const resData = await response.json();

    return { success: true, visitAdded: true, resData: resData };
  }

  // profile create/edit action
  const profileData = {
    name: data.get("name"),
    email: data.get("email"),
  };

  if (data.get("registrationDate")) {
    profileData.registrationDate = data.get("registrationDate");
  }

  let url = "http://localhost:5000/api/customer";
  if (method === "PATCH") {
    url += "/" + params.customerId;
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { errors: [errorData.error || "Could not save customer profile."] };
  }

  const resData = await response.json();
  if (response.status === 201) {
    return redirect(`/customers/profile/${resData.id}`);
  }

  return { success: true, message: "Customer profile data updated!" };

  // return redirect(`/customers/profile/${params.customerId}`);
}
