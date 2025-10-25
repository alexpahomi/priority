import { Form, useNavigation, useActionData } from "react-router";
import { useFetch } from "../hooks/useFetch";
import Alert from "./UI/Alert";
import { useEffect, useRef } from "react";

const getRequestConfig = {}; // defined ext because it's used as dependency in useFetch

export default function VisitForm({ customerId, onClose }) {
  const data = useActionData();
  const navigation = useNavigation();
  const formRef = useRef();

  const {
    data: hotels,
    isLoading: loading,
    error,
  } = useFetch("http://localhost:5000/api/Hotel", getRequestConfig, []);

  const isSubmitting = navigation.state === "submitting";
  const isVisitData = data && data.visitAdded;

  // reset form after successful visit addition
  useEffect(() => {
    if (data?.visitAdded && formRef.current) {
      formRef.current.reset();
    }
  }, [data]);

  return (
    <Form method="post" ref={formRef}>
      <div className="modal-header">
        <h5 className="modal-title">Register New Visit</h5>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          disabled={isSubmitting}
        ></button>
      </div>

      <div className="modal-body">
        {loading && <p>Loading hotels...</p>}
        {error && <Alert type="danger">{error}</Alert>}

        {isVisitData && data.errors && (
          <ul className="text-danger">
            {Object.values(data.errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        {!loading && !error && (
          <>
            <div className="mb-3">
              <label htmlFor="hotelId" className="form-label">
                Select Hotel
              </label>
              <select
                id="hotelId"
                name="hotelId"
                className="form-select"
                required
                disabled={isSubmitting}
              >
                <option value="">Choose a hotel...</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.location} (Rating: {hotel.rating})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="visitDate" className="form-label">
                Visit Date
              </label>
              <input
                type="date"
                id="visitDate"
                name="visitDate"
                className="form-control"
                required
                disabled={isSubmitting}
              />
            </div>

            <input type="hidden" name="customerId" value={customerId} />
          </>
        )}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-sm btn-secondary me-2"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-sm btn-dark"
          disabled={isSubmitting || loading || error}
        >
          {isSubmitting ? "Registering..." : "Register Visit"}
        </button>
      </div>
    </Form>
  );
}
