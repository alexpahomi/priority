import { Form, useActionData, useNavigation } from "react-router";
import { toLocalDatetimeString } from "../utils/formatting";
import Alert from "./UI/Alert";

export default function CustomerForm({ customer, method }) {
  const navigation = useNavigation();
  const data = useActionData();

  const isSubmitting = navigation.state === "submitting";
  const isCustomerData = data && !data.visitAdded;

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-white mb-3 rounded shadow-sm border p-3">
            <Form method={method}>
              {isCustomerData && data.errors && (
                <ul className="text-danger">
                  {Object.values(data.errors).map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}

              {isCustomerData && data.success && (
                <Alert type="success">{data.message}</Alert>
              )}

              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-medium">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  defaultValue={customer?.name || ""}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">
                  Customer Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  defaultValue={customer?.email || ""}
                  required
                />
              </div>

              {customer && (
                <div className="mb-3">
                  <label
                    htmlFor="registrationDate"
                    className="form-label fw-medium"
                  >
                    Registration Date
                  </label>

                  <input
                    type="datetime-local"
                    name="registrationDate"
                    className="form-control"
                    defaultValue={
                      customer && customer.registrationDate
                        ? toLocalDatetimeString(customer.registrationDate)
                        : ""
                    }
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-dark"
                disabled={isSubmitting}
              >
                {method === "patch" ? "Update Profile" : "Create Profile"}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
