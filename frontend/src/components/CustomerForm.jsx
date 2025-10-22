import { Form } from "react-router";

export default function CustomerForm({ customer, method }) {
  function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);
  }

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card bg-white mb-3 rounded shadow-sm border p-3">
            <Form method={method} action={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-medium">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={customer?.name || ""}
                  required
                  className="form-control"
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
                  defaultValue={customer?.email || ""}
                  required
                  className="form-control"
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
                    defaultValue={customer?.registrationDate || ""}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-dark">
                {customer ? "Update Customer" : "Create Profile"}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
