import { Link } from "react-router";
import { formatDate } from "../utils/formatting";

export default function VisitationsGrid({ visits = [] }) {
  return (
    <>
      {visits && visits.length > 0 && (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Visit ID</th>
              <th>Customer</th>
              <th>Hotel</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.id}</td>
                <td>
                  <Link to={`/customers/profile/${visit.customerId}`}>
                    {visit.customerName}
                  </Link>
                </td>
                <td>{visit.hotelName}</td>
                <td>{formatDate(visit.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!visits ||
        (visits.length === 0 && (
          <div className="alert alert-info text-center" role="alert">
            <p className="mb-0">No visits found.</p>
          </div>
        ))}
    </>
  );
}
